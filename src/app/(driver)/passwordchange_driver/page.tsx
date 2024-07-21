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
                    <h1 className='text-4xl text-white'>Change Password</h1>

                    <form method='POST' >
                        <div className='flex flex-col gap-5'>
                            
                            <div className="relative">
                                <input
                                    type="password"
                                    name='pass'
                                    id='pass'
                                    className='peer w-80  text-white border-b-2 outline-none bg-transparent p-2'
                                    placeholder='Password'
                                    required
                                />
                                <LockClosedIcon className="absolute z-0 right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />

                            </div><div className="relative">
                                <input
                                    type="password"
                                    name='pass'
                                    id='pass'
                                    className='peer w-80  text-white border-b-2 outline-none bg-transparent p-2'
                                    placeholder='Confirm Password'
                                    required
                                />
                                <LockClosedIcon className="absolute z-0 right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />

                            </div>
                            <button className='bg-secondary-light w-80 rounded-xl p-2'>Save Change</button>
                            <div className='p-5' >

                            </div>
                           
                        </div>
                    </form>
                </div>
            </div>


        </div>

    )
}

export default page
