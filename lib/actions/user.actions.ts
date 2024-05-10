'use server';
import { SignUpParams, signInProps } from "@/types";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/constants";
import { parseStringify } from "../utils";
import axios from "axios";
import { redirect } from "next/navigation";

export const signUp = async (userData: SignUpParams) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/register`, userData);
    return response.data
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