'use client'
import React, { useEffect, useState } from 'react'
import Header from '@/component/driver/driver_header/header'
import Body from '@/component/driver/body/body'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const router = useRouter();
  const [spin, setSpin] = useState(false)

  useEffect(() => {
    try {
      const loading = localStorage.getItem('dloading')
      const isdriver = localStorage.getItem('isdriver');
      
      if (!isdriver) {
        router.push('/login_driver');
      }
      else{
        setSpin(true)
      }
      if (loading) {
        toast(loading, { type: 'success', theme: 'dark', hideProgressBar: true, pauseOnHover: false, })
        localStorage.removeItem('dloading')
        const timer = setTimeout(() => {
        }, 1000);
      }
    }
    catch {
      router.push('/login_driver');
    }
  }, [])

  if (!spin) {
    return (
      <div className='bg-white w-full h-screen flex justify-center items-center'>
      <ToastContainer />
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div>
      <ToastContainer />
      <div className='bg-secondary'>
        <Header />
      </div>
      <Body />
    </div>
  );
};

export default Page;
