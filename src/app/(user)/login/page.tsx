'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import login from '../../../../public/static/login.jpg'
import { MailIcon, LockClosedIcon } from '@heroicons/react/solid';
import httpClient from '@/app/httpClient'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Nav from '@/component/nav/nav'

const page = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useRouter();



  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const data = {
      email: email,
      password: password,
    }
    try {

      const response = await httpClient.post('auth/signin', data);
      console.log(response)
      if (response.data['message'] === 'Login successful') {
        const access_token = response.data.tokens.accessToken;
        const refresh_token = response.data.tokens.refreshToken;

        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('name', response.data.tokens.fullname)
        localStorage.setItem('loading',response.data['message'])
        navigate.push('/')
      } else {
        toast(response.data['message'], { type: 'error', theme: 'dark', hideProgressBar: true, pauseOnHover: false, })
      }
    } catch {
      toast('error', { type: 'error', theme: 'dark', hideProgressBar: true, pauseOnHover: false, })

    }

  }


  return (
    <div className='bg-primary min-h-screen'>

      <Nav />

      <div className='flex w-full justify-center align-center h-screen'>
        <div className='bg-primary w-full lg:w-3/5 h-4/6 sm:m-5 flex flex-col md:flex-row border border-white'>
          <div className='flex flex-col gap-5 w-full md:w-1/2 items-center justify-evenly md:m-3'>
            <h1 className='text-4xl text-white'>LogIn</h1>
            <ToastContainer />
            <form method='POST' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-5'>
                <div className="relative">
                  <input
                    id='email'
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    className='peer text-white border-b-2 z-1 outline-none bg-transparent p-2'
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
                    className='peer text-white border-b-2 outline-none bg-transparent p-2'
                    placeholder='Password'
                    required
                  />
                  <LockClosedIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                </div>
                <button className='bg-white rounded-xl p-2 text-black'>Login</button>
                <div className='p-5' >

                </div>
                <p className='text-center text-sm text-white'>
                  Don't have an account? <Link href={'/signup'} className='text-blue-600'>signup</Link>
                </p>
              </div>
            </form>
          </div>
          <div className='w-full md:w-1/2 flex items-center justify-center hidden md:block lg:block'>
            <div className="relative w-full h-64 md:h-full">
              <Image src={login} alt='Login Image' layout='fill' objectFit='cover' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default page
