'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import image from '../../../../public/static/WhatsApp_Image_2024-06-06_at_10.26.33_b4404c62-removebg-preview.png'
import image2 from '../../../../public/static/WhatsApp Image 2024-06-17 at 6.36.02 PM.jpeg'
import { LockClosedIcon, MailIcon } from '@heroicons/react/solid'
import httpClient from '@/app/httpClient'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'

const page = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useRouter();
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const toke = localStorage.getItem('isadmin')
        if (toke) {
            navigate.push('/dashboard')
        }
        else {
            setLoading(true)
        }
    }, [])


    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()

        const data = {
            'email': email,
            'password': password
        }
        try {

            const response = await httpClient.post('auth/admin_login', data);
            if (response.data['message'] === 'Login successful') {
                const access_token = response.data.a_tokens.accessToken;
                const refresh_token = response.data.a_tokens.refreshToken;

                localStorage.setItem('aaccessToken', access_token);
                localStorage.setItem('arefreshToken', refresh_token);
                localStorage.setItem('aname', response.data.a_tokens.fullname)
                localStorage.setItem('isadmin', 'true')
                localStorage.setItem('aloading', response.data['message'])
                navigate.push('/dashboard')
            } else {
                toast(response.data.message, { type: 'error', theme: 'dark', hideProgressBar: true, pauseOnHover: false, })
            }
        }
        catch {
            toast('credantials are not found', { type: 'error', theme: 'dark', hideProgressBar: true, pauseOnHover: false, })
        }
    }

    if (!loading) {
        return (

            <div className='bg-territory w-full h-screen flex justify-center items-center'>
                <span className="loading loading-spinner loading-lg"></span>
            </div>)

    }

    return (
        <div className='h-screen bg-territory'>
            <div className=''>

                <nav className="mx-auto flex max-w-full items-center justify-between p-4 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="m-1.5 p-1.5">
                            <Image className="h-10 w-auto" src={image} alt="example" />
                        </Link>
                    </div>
                </nav>
            </div>
            <div className='w-full h-3/4 flex justify-center items-center'>
                <div className='w-1/2 hidden md:flex md:flex-col justify-center border-white border-r-2'>
                    <Image src={image2} alt='' />
                </div>
                <div className='w-1/2 lg:w-1/2 gap-10 flex flex-col justify-center items-center h-full'>
                    <h1 className='text-4xl text-white'>LogIn</h1>
                    <ToastContainer />
                    <form method='POST' onSubmit={handleSubmit} >
                        <div className='flex flex-col gap-5'>
                            <div className="relative">
                                <input
                                    id='email'
                                    type="email"
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='peer w-80  text-white border-b-2 z-1 outline-none bg-transparent p-2'
                                    placeholder='Email'
                                    required
                                />
                                <MailIcon className="absolute z-0 right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    name='pass'
                                    id='pass'
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='peer w-80  text-white border-b-2 outline-none bg-transparent p-2'
                                    placeholder='Password'
                                    required
                                />
                                <LockClosedIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                            </div>
                            <button className='bg-secondary-light w-80 rounded-xl p-2 text-black' type='submit'>Login</button>
                            <div className='p-5' >

                            </div>
                            <p className='text-center text-sm text-white'>
                                forgot password? <Link href={'/'} className='text-blue-600'>click here</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default page
