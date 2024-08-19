'use client'
import React, { useEffect, useState } from 'react'
import Header from '@/component/driver/driver_header/header'
import Body from '@/component/driver/body/body'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'

const Page = () => {
  const router = useRouter();
  const [spin, setSpin] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {

        const loading = localStorage.getItem('dloading')
        const isdriver = localStorage.getItem('isdriver');

        if (!isdriver) {
          router.push('/login_driver');
        }
        else {
          setSpin(true)
        }
        if (loading) {
          toast.success(loading)
          localStorage.removeItem('dloading')
          const timer = setTimeout(() => {
          }, 1000);
        }
      }
      catch {
        router.push('/login_driver');
      }
    }
  }, [router])

  if (!spin) {
    return (
      <div className='bg-white w-full h-screen flex justify-center items-center'>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div>
      <div className='fixed'>
        <Toaster position="top-right" richColors />
      </div>
      <div className='bg-secondary'>
        <Header />
      </div>
      <Body />
    </div>
  );
};

export default Page;
