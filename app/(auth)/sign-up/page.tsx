import AuthForm from '@/components/AuthForm'
import { COOKIE_NAME } from '@/constants'
import { getToken } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
const SignUp = async () => {
  // const token = await getToken(COOKIE_NAME)
  // if(token) return redirect("/user/dashboard")
  return (
    <section className='flex-center size-full max-sm:px-6 ' >
        <AuthForm type="sign-up" />
    </section>
  )
}

export default SignUp