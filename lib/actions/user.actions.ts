'use server';
import { SignUpParams, User, createBankAccountProps, exchangePublicTokenProps, signInProps } from "@/types";
import { cookies } from "next/headers";
import { COOKIE_NAME, ssnRegex } from "@/constants";
import { capitalizeFirstTwoLetters, encryptId, extractCustomerIdFromUrl, generateUniqueUserId, getValidSSN, parseStringify } from "../utils";
import axios from "axios";
import { redirect } from "next/navigation";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "@/lib/plaid";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import { revalidatePath } from "next/cache";

export const signUp = async (userData: SignUpParams) => {
  try {
    const ssn = getValidSSN(userData.ssn)
    const abbreviatedState =  capitalizeFirstTwoLetters(userData.state)
    const dwollaData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      state: abbreviatedState,
      email: userData.email,
      address1: userData.address1,
      city: userData.city,
      postalCode: userData.postalCode,
      dateOfBirth: userData.dateOfBirth,
      ssn: ssn
    }
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...dwollaData,
      type: "personal",
    })

    if(!dwollaCustomerUrl) throw new Error('Error creating dwolla customer')
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)
    const data = {
      ...userData,
      dwollaCustomerId,
      dwollaCustomerUrl
    }
    
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/register`, data);
    if(!response.data) throw new Error('Error creating new user')
    
    const {token, user} = response.data
    setCookie(token)
    return parseStringify(user)
  } catch (error) {
    console.error('Error', error);
  }
}

export const signIn = async (userData: signInProps) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/login`, userData);
    const {token} = response.data
    return await setCookie(token)
  } catch (error) {
    console.error('Error', error);
  }
}

export async function getLoggedInUser() {
  try {
    const token = await getToken(COOKIE_NAME)
    await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}sanctum/csrf-cookie`)
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
    const {user} = response.data
    return user
  } catch (error) {
    return error;
  }
}

export const logoutUser = async () => {
  try{
    cookies().delete(COOKIE_NAME)
    return await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/logout`)
  }catch(error){
    return null
  }
}

export async function setCookie(data: any){
  return cookies().set(COOKIE_NAME, data, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires: Date.now() + 24 * 60 * 60 * 1000 *3
  });
}

export async function getToken(cookieName: string){
  return cookies().get(cookieName)?.value;
}

export const createLinkToken = async (user: User) => {
  try{
    const tokenParams = {
      user: {
        client_user_id: generateUniqueUserId(user.id)
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ["US"] as CountryCode[]
    }

    const res = await plaidClient.linkTokenCreate(tokenParams)
    return parseStringify({linkedToken: res.data.link_token})
  }catch(error){
    console.log(error)
  }
} 

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const data = {
      userId,
      bankId,
      accountId,
      accessToken,
      fundingSourceUrl,
      shareableId,
    }
    const token = await getToken(COOKIE_NAME)
    await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}sanctum/csrf-cookie`)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/external-bank-accounts`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
    const {bankAccount} = response.data
    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
}

export const exchangePublicToken = async ({
  publicToken, user
}: exchangePublicTokenProps) => {
  try{
    const res = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    })
    const accessToken = res.data.access_token
    const itemId = res.data.item_id

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken
    })
    const accountData = accountsResponse.data.accounts[0]

    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
    }

    const processorTokenResponse = await plaidClient.processorTokenCreate(request)
    const processorToken = processorTokenResponse.data.processor_token
    
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name
    })

    if(!fundingSourceUrl) throw Error

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id)
    })

    revalidatePath("/user/dashboard")

    return parseStringify({
      publicTokenExchange: "completed"
    })
  }catch(error){
    console.log(`An error occured while creating exchange token: ${error}`)
  }
}