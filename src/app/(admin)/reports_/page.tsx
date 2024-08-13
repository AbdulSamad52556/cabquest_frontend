'use client'
import Sidenav from '@/component/admin/side_nav/sidenav'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer } from 'react-toastify';


const Page = () => {
  const navigate = useRouter();
  const [spin, setSpin] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    try{
      const token = localStorage.getItem('isadmin')
      if(token){
        setSpin(true)
      }else{
        navigate.push('admin_login')
      }
    }catch{

    }
  },[navigate])

  if (!spin) {
    return (
      <div className='bg-white w-full h-screen flex justify-center items-center'>
      <ToastContainer />
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }
  return (
    <div className='bg-white'>
      <div>
            <Sidenav/>
        </div>
    </div>
  )
}

export default Page
