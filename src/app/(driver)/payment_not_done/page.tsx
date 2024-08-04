'use client'
import Header from '@/component/driver/driver_header/header'
import React, { useEffect } from 'react'
import image from '../../../../public/static/error.jpg'
import Image from 'next/image'

const Page = () => {

  useEffect(()=>{
    
  },[])
  return (
    <div className='bg-black h-screen'>
      <div className='bg-black z-10'>
        <Header />
      </div>
      <div className='flex flex-col items-center'>
        <Image className='w-52 relative z-0 -mt-8' src={image} alt=''/>
        <h1 className='absolute text-2xl text-white z-1 mt-10'>Waiting for the payment ...</h1>
        <button className='p-2 bg-primary-dark text-white w-1/2 -mt-10 z-10 rounded-md text-sm md:text-xl hover:bg-blue-800'>
          paid by cash
        </button>
      </div>
      <div className='flex justify-center z-10 -mt-10'>
      </div>
    </div>
  )
}

export default Page
