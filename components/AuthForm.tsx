"use client"
import Link from "next/link"
import Image from "next/image"
import { APP_NAME } from "@/constants"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from "./CustomInput"
import { authFormSchema } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const AuthForm = ({type}: {type: string}) => {
    const [user, setUser] = useState(null)
    const [isLoading, setisLoading] = useState(false)

    const authformSchema = authFormSchema(type)
    const form = useForm<z.infer<typeof authformSchema>>
    ({
        resolver: zodResolver(authformSchema),
        defaultValues: {
          email: "",
          password: ""
        },
    })
    
    function onSubmit(values: z.infer<typeof authformSchema>) {
        setisLoading(true)
        console.log(values)
        setisLoading(false)
    }
  return (
    <section className='auth-form m-5' >
        <header className='flex flex-col gap-5 md:gap-8 ' >
            <Link href={"/"} className="cursor-pointer flex items-center gap-1">
                <Image
                    src={"/icons/logo.svg"}
                    width={34}
                    height={34}
                    alt={`${APP_NAME} logo`}
                />
                <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1 ">{APP_NAME}</h1>
            </Link>
            <div className="flex flex-col gap-1 md:gap-3">
                <h1 className="text-24 lg:text-36 font-semibold text-gray-900" >
                    { user ? "Link Account" : type === 'sign-in' ? 'Sign In' : 'Sign Up' }
                    <p className="text-16 font-normal text-gray-600">
                        { user ? "Link account to get started" : 'Please enter your details'}
                    </p>
                </h1>
            </div>
        </header>
        {user ? (
            <div className="flex flex-col gap-4">
                Plaid links
            </div>
        ) : (
            <>
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {type === 'sign-up' && (
                            <>
                                <div className="flex gap-4">
                                    <CustomInput control={form.control} name='firstName' label="First Name" placeholder='Enter your first name' type={"text"} />
                                    <CustomInput control={form.control} name='lastName' label="Last Name" placeholder='Enter your first name' type={"text"} />
                                </div>
                                <CustomInput control={form.control} name='address1' label="Address" placeholder='Enter your specific address' type={"text"} />
                                <CustomInput control={form.control} name='city' label="City" placeholder='Enter your city' type={"text"} />
                                <div className="flex gap-4">
                                    <CustomInput control={form.control} name='state' label="State" placeholder='Example: NY' type={"address"} />
                                    <CustomInput control={form.control} name='postalCode' label="Postal Code" placeholder='Example: 11101' type={"text"} />
                                </div>
                                <div className="flex gap-4">
                                    <CustomInput control={form.control} name='dateOfBirth' label="Date of Birth" placeholder='YYYY-MM-DD' type={"date"} />
                                    <CustomInput control={form.control} name='ssn' label="SSN" placeholder='Example: 1234' type={"text"} />
                                </div>
                            </>
                        )}
                        <CustomInput 
                            control={form.control}
                            name={"email"}
                            label={"Email"}
                            placeholder={"Enter your email"}
                            type={"email"}
                        />

                        <CustomInput 
                            control={form.control}
                            name={"password"}
                            label={"Password"}
                            placeholder={"Enter your password"}
                            type={"password"}
                        />
                        <div className="flex flex-col gap-4">
                            <Button className="form-btn" disabled={isLoading} type="submit">
                                {
                                    isLoading ? (
                                        <>
                                            <Loader2 size={20}
                                                className="animate-spin"
                                            />
                                            &nbsp; Loading...
                                        </>
                                    ) : type === 'sign-in' ? "Sign In" : "Sign Up"
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
                <footer className="flex justify-center gap-1">
                    <p>
                        {type === 'sign-in' ? (<Link href={"/sign-up"}>Don't have an account ?</Link>) : 
                        <Link href={"/sign-in"}>Already have an account ?</Link>}
                    </p>
                </footer>
            </>
        )}
    </section>
  )
}

export default AuthForm