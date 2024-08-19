'use client'
import Nav from '@/component/nav/nav'
import { LockClosedIcon, MailIcon, UserCircleIcon, PhoneIcon, LockOpenIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import Link from 'next/link'
import httpClient from '@/app/httpClient'
import React, { useState } from 'react'
import driver from '../../../../public/static/a0c581b016877d23dc870185ad1a9e9e-removebg-preview.png'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation';
import image from '../../../../public/static/Eclipse@1x-1.0s-200px-200px (1).gif'

const Page = () => {
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('');
    const navigate = useRouter();
    const [loading, isLoading] = useState(false)
    const [lock, setLock] = useState<boolean>(true)
    const [passwordType, setPasswordType] = useState<string>('password')

    const handleLockClick = () => {
        setLock(!lock);
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        isLoading(true)
        e.preventDefault()
        try{

        const response = await httpClient.post('auth/driver_register', { fullname, email, password, phone });
        if (response.data.message === "A confirmation email has been sent.") {
            toast.success(response.data.message);
            isLoading(false)
            const timer = setTimeout(() =>{
                navigate.push('/login_driver')
            },1000)
        }
        else {
            isLoading(false)
            toast.error(response.data.message);

        }
        }
        catch{
            isLoading(false)
            toast.error('error');

        }

    }

    return (
        <div className='bg-secondary w-full h-screen'>
            <div className='fixed'>
              <Toaster position="top-right" richColors />
            </div>
            <Nav />
            <div className='w-full p-5 h-3/4 flex'>

                <div className='hidden lg:block lg:w-1/2 gap-10 h-full'>
                    <div className=' flex justify-center items-center h-full' >
                        <Image className='lg:w-3/4 ' alt={''} src={driver} />
                    </div>

                </div>
                <div className='w-full lg:border-l-2 lg:border-l-white lg:w-1/2 gap-10 flex flex-col justify-center items-center h-full'>
                    <h1 className='text-4xl text-white'>SignUp</h1>

                    <form method='POST' onSubmit={handleSubmit} >
                        <div className='flex flex-col gap-5'>
                            <div className="relative">
                                <input
                                    id='fullname'
                                    type="text"
                                    name="fullname"
                                    value={fullname}
                                    className='peer w-80 text-white border-b-2 outline-none bg-transparent p-2'
                                    placeholder='FullName'
                                    onChange={(e) => setFullname(e.target.value)}
                                    required
                                />
                                <UserCircleIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                            </div>
                            <div className="relative">
                                <input
                                    id='email'
                                    type="email"
                                    name="email"
                                    value={email}
                                    className='peer w-80  text-white border-b-2 z-1 outline-none bg-transparent p-2'
                                    placeholder='Email'
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <MailIcon className="absolute z-0 right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                            </div>
                            <div className="relative">
                                <input
                                    id='phone'
                                    type="text"
                                    name="phone"
                                    value={phone}
                                    className='peer w-80  text-white border-b-2 z-1 outline-none bg-transparent p-2'
                                    placeholder='Phone'
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <PhoneIcon className="absolute z-0 right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                            </div>
                            <div className="relative">
                                <input
                                    type={passwordType}
                                    name='pass'
                                    id='pass'
                                    value={password}
                                    className='peer w-80  text-white border-b-2 outline-none bg-transparent p-2'
                                    placeholder='Password'
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {lock ? (
                                    <LockClosedIcon onClick={handleLockClick} className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                                ) : (
                                    <LockOpenIcon onClick={handleLockClick} className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                                )}
                                
                            </div>
                            {loading ?
                                <button className='bg-secondary-light w-80 flex justify-center items-center rounded-xl p-2'><Image className='w-6' src={image} alt='' /></button>
                                :
                                <button className='bg-secondary-light w-80 rounded-xl p-2 text-black' type='submit'>SignUp</button>
                            }
                            <div className='p-5' >

                            </div>
                            <p className='text-center text-sm text-white'>
                                Already have an account <Link href={'/login_driver'} className='text-blue-600'>login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>


        </div>

    )
}

export default Page
