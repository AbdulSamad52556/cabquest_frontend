import Nav from '@/component/nav/nav'
import { LockClosedIcon, MailIcon, UserCircleIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import driver from '../../../../public/static/b53a2a2e855f9250f35b49d9f73b99d5-removebg-preview.png'

const page = () => {
    return (
        <div className='bg-secondary w-full h-screen'>
            <Nav />
            <div className='w-full p-5 h-3/4 flex'>

                <div className='hidden lg:block lg:w-1/2 gap-10 h-full'>
                    <div className=' flex justify-center items-center h-full' >
                        <Image className='lg:w-3/4 ' alt={''} src={driver} />
                    </div>

                </div>
                <div className='w-full lg:border-l-2 lg:border-l-white lg:w-1/2 gap-10 flex flex-col justify-center items-center h-full'>
                    <h1 className='text-4xl text-white'>Enter OTP</h1>

                    <form method='POST' >
                        <div className='flex flex-col gap-5'>
                            
                            <div className="relative">
                                <input
                                    type="password"
                                    name='pass'
                                    id='pass'
                                    className='peer w-80  text-white border-b-2 outline-none bg-transparent p-2'
                                    placeholder='OTP'
                                    required
                                />
                                <LockClosedIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                            </div>
                            <button className='bg-secondary-light w-80 rounded-xl p-2'>verify</button>
                            <div className='p-5' >

                            </div>
                            <p className='text-center text-sm text-white'>
                                Don't have an account? <Link href={'/login_driver'} className='text-blue-600'>login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>


        </div>

    )
}

export default page
