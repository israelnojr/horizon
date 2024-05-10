import { logoutUser } from '@/lib/actions/user.actions'
import { FooterProps } from '@/types'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

const Footer = ({user, type="desktop"}: FooterProps) => {
    const router = useRouter()
    const handleLogout = async () => {
        await logoutUser()
        router.push('/sign-in')
    }
  return (
    <footer className={`footer ${type=== 'mobile' ? 'mb-8 ' :''}`} >
        <div className={type=== 'mobile' ? 'footer_name-mobile' :'footer_name'}>
            <p className='text-xl font-bold text-gray-700' >
                {user.firstName[0]}
            </p>
        </div>
        <div className={type=== 'mobile' ? 'footer_email-mobile' :'footer_email'} >
            <h1 className="text-14 truncate font-semibold text-gray-700">
                {` ${user.firstName} ${user.lastName}`}
            </h1>
            <p className="text-14 truncate font-normal text-gray-600">{user.email}</p>
        </div>
        <div className="footer_image ml-5" onClick={handleLogout} >
            <Image
                src="/icons/logout.svg"
                fill
                alt={`${process.env.APP_NAME} logo`}
            />
        </div>
    </footer>
  )
}

export default Footer 