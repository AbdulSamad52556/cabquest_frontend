'use client'
import Sidenav from '@/component/admin/side_nav/sidenav'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const page = () => {
    const navigate = useRouter();
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
    const a_tokens = localStorage.getItem('aaccessToken') 
    const aloading = localStorage.getItem('aloading')
    if (!a_tokens){
        navigate.push('/admin_login')
    }else{
        setLoading(true)
    }
    if (aloading){
        toast(aloading, { type: 'success', theme: 'dark', hideProgressBar: true, pauseOnHover: false, })
        const timer = setTimeout(() => {
            localStorage.removeItem('aloading')
          }, 3000);
    }
        
    },[])

    if (!loading){
        return (
            <div className='bg-white w-full h-screen flex justify-center items-center'>
            <ToastContainer/>

            <span className="loading loading-spinner loading-lg"></span>
            </div>

        )
    }

        return (
        <div className='flex bg-white'>
            <ToastContainer/>
            <div>
                <Sidenav />
            </div>
            <div>
                hello
            </div>
        </div>
    )
}

export default page
