'use client'
import React, { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import image from '../../../../public/static/WhatsApp_Image_2024-06-05_at_23.43.42_16f84c9f-removebg-preview.png'
import { LockClosedIcon } from '@heroicons/react/solid';
import httpClient from '@/app/httpClient'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import axios from 'axios';

const Page = () => {

  const [otp, setOtp] = useState('')
  const navigate = useRouter();
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  if (!email) {
    navigate.push('/');
    return null;
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const data = { 'otp': otp, 'email': email }
    const response = await httpClient.post('auth/verify', data);

    if (response.data['message'] === 'Account Created') {
      const communicationData = response.data['communication'];
      const response2 = await axios.post('https://communication.cabquest.quest/queue',communicationData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,  // Make sure cookies are sent
        }
      )
      toast.success('Account Created')
      const timer = setTimeout(() => {
        navigate.push('/login');
      }, 1500);
    } else if (response.data['message'] == 'user is not found') {
      toast.error('user is not found')
    }
  }

  return (

    <div className='bg-primary min-h-screen'>

      <nav className="mx-auto flex max-w-full items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="m-1.5 p-1.5">
            <Image className="h-10 w-auto" src={image} alt="example" />
          </Link>
        </div>
      </nav>

      <div className='flex w-full justify-center align-center h-screen'>
        <div className='bg-primary md:w-1/2 h-4/6 flex  flex-row md:border md:border-white'>
          <div className='flex flex-col w-full md:w-full items-center justify-evenly md:m-3'>
            <h1 className='text-4xl text-white p-2'>Enter your OTP</h1>
            <div className='fixed'>
              <Toaster position="top-right" richColors />
            </div>
            <form method='POST' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-5'>
                <div className="relative">
                  <input id='otp' autoComplete='off' type="text" onChange={(e) => setOtp(e.target.value)} name="otp" className='peer w-80 text-white border-b-2 outline-none bg-transparent p-2' placeholder='OTP' />
                  <LockClosedIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                </div>
                <button className='bg-white rounded-xl p-2 text-black'>verify</button>
              </div>

            </form>
            <p className='text-center text-sm text-white'>
              <Link href={'/signup'} className='text-blue-600'>resend</Link>
            </p>
            <div className='h-10'>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

const OtpPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
};

export default OtpPage;