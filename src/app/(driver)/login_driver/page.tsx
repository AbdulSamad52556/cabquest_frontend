'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Nav from '@/component/nav/nav'
import { LockClosedIcon, MailIcon, LockOpenIcon } from '@heroicons/react/solid'
import driver from '../../../../public/static/Agronomist _ back to 1950.gif'
import httpClient from '@/app/httpClient'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation';
import image from '../../../../public/static/Eclipse@1x-1.0s-200px-200px (1).gif'

const Page = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useRouter();
    const [loading, isLoading] = useState(false)
    const [spin, setSpin] = useState(false)
    const [lock, setLock] = useState<boolean>(true)
    const [passwordType, setPasswordType] = useState<string>('password')

    const handleLockClick = () => {
        setLock(!lock);
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    };


    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const tok = localStorage.getItem('isdriver')
                if (tok) {
                    navigate.push('/driver_registration')
                }
                else {
                    setSpin(true)
                }
            } catch {
                setSpin(true)

            }
        }
    }, [navigate])

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        isLoading(true)
        e.preventDefault()
        try {
            const response = await httpClient.post('auth/driver_auth', { email, password })
            console.log(response.data)
            if (response.data.message === 'Login successful') {
                const access_token = response.data.d_tokens.accessToken;
                const refresh_token = response.data.d_tokens.refreshToken;

                localStorage.setItem('daccessToken', access_token);
                localStorage.setItem('drefreshToken', refresh_token);
                localStorage.setItem('dname', response.data.d_tokens.fullname)
                localStorage.setItem('isdriver', 'true')
                localStorage.setItem('dloading', 'login successful')
                isLoading(false)
                if (response.data.d_tokens.kyc === true) {
                    navigate.push('/driver_hub')
                }
                else {
                    navigate.push(`/driver_registration`)
                }
            }
            else {
                isLoading(false)
                toast.warning(response.data.message)
            }
        } catch (error) {
            isLoading(false)
            toast.error('error')

        }

    }

    if (!spin) {
        return (
            <div className='bg-white w-full h-screen flex justify-center items-center'>
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <div className='bg-secondary w-full h-screen'>

            <Nav />
            <div className='w-full p-5 h-3/4 flex'>
            <div className='fixed'>
              <Toaster position="top-right" richColors />
            </div>
                <div className='w-full lg:border-r-2 lg:border-r-white lg:w-1/2 gap-10 flex flex-col justify-center items-center h-full'>
                    <h1 className='text-4xl text-white'>LogIn</h1>

                    <form method='POST' onSubmit={handleSubmit}  >
                        <div className='flex flex-col gap-5'>
                            <div className="relative">
                                <input
                                    id='email'
                                    type="email"
                                    name="email"
                                    className='peer w-80  text-white border-b-2 z-1 outline-none bg-transparent p-2'
                                    placeholder='Email'
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <MailIcon className="absolute z-0 right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                            </div>
                            <div className="relative">
                                <input
                                    type={passwordType}
                                    name='pass'
                                    id='pass'
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
                                <div className='bg-secondary-light w-80 flex justify-center items-center rounded-xl p-2'><Image className='w-6' src={image} alt='' /></div>
                                :
                                <button className='bg-secondary-light text-black w-80 rounded-xl p-2' type='submit'>Login</button>
                            }
                            <div className='p-5' >
                            </div>
                            <p className='text-center text-sm text-white'>
                                Don't have an account? <Link href={'/signup_driver'} className='text-blue-600'>signup</Link>
                            </p>
                        </div>
                    </form>
                </div>
                <div className='hidden lg:block border-l-0 border-l-white lg:w-1/2 gap-10 h-full'>
                    <div className=' flex justify-center items-center h-full' >
                        <Image src={driver} className='lg:w-3/4 ' alt={''} />
                    </div>

                </div>
            </div>


        </div>
    )
}

export default Page
