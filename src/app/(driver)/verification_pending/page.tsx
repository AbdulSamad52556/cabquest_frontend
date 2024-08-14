'use client'
import React, { useEffect, useState } from 'react'
import Header from '@/component/driver/driver_header/header'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode';
import httpClient from '@/app/httpClient';

const Page = () => {

  const navigate = useRouter();
  const [spin, setSpin] = useState(false)



  useEffect(()=>{
    if (typeof window !== 'undefined') {
    const isdriver = localStorage.getItem('isdriver')
    const isverified = async()=>{
      const token = localStorage.getItem('daccessToken')
      const decodedToken = jwtDecode(token!);
      const email = decodedToken.sub;
      try{
  
        const response = await httpClient.post('auth/isdriververified',{'email':email})
        if(response.data['message'] === 'true'){
          navigate.push('/driver_hub')
        }
      }catch{
        console.log('none')
      }
    }
    isverified();
    setTimeout(() => {
      if (isdriver){
        setSpin(true)
      }
    }, 3000);
  }
  },[navigate])

  if (!spin) {
    return (
      <div className='bg-white w-full h-screen flex justify-center items-center'>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className='h-screen bg-white'>
      <div className='bg-secondary'>
        <Header />
      </div>
      <div className='flex flex-col text-black bg-white justify-center items-center'>
        <div className='m-10'>
          <h1 className='text-2xl md:text-3xl lg:text-5xl font-bold'>KYC Verification Pending</h1>
        </div>
        <div className='flex'>
          <h1 className='text-l md:text-xl lg:text-3xl font-semibold'>please wait</h1>
          <div className='flex justify-end items-end'>

          <span className="loading loading-dots loading-md"></span>
          </div>

        </div>
        <div className='p-3'>
          <p className='text-center text-sm'>We appreciate your decision for working with us. Verification will take some time to verify your registration we will let you know when the Verification finished</p>
        </div>
      </div>
    </div>
  )
}

export default Page
