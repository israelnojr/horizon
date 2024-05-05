"use client"
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { APP_NAME, sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
const SideBar = ({user}: SiderbarProps) => {
    const pathName = usePathname()
  return (
    <section className='sidebar' >
        <nav className="flex-col gap-4 ">
            <Link href='/' className='flex mb-12 cursor-pointer items-center gap-2' >
                <Image
                    src="/icons/logo.svg"
                    width={34}
                    height={34} 
                    alt={`${process.env.APP_NAME} logo`}
                    className='size-[24px] max-xl:size-14 '
                />
                <h1 className="sidebar-logo">{APP_NAME}</h1>
            </Link>
            {
                sidebarLinks.map((item)=>{
                    const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)
                    return (
                        <Link 
                            href={item.route} 
                            key={item.label}
                            className={cn('sidebar-link flex ',{
                                'bg-bank-gradient': isActive
                            })}
                         >
                            <div className="relative size-6">
                                <Image
                                    src={item.imgURL}
                                    alt={item.label}
                                    fill
                                    className={cn({
                                        'brightness-[3] invert-0': isActive
                                    })}
                                />
                            </div>
                            <p className={cn("sidebar-label", { "!text-white": isActive })}>
                                {item.label}
                            </p>
                        </Link>
                    )
                })
            }
        </nav>
    </section>
  )
}

export default SideBar