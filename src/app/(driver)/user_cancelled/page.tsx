'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/component/driver/driver_header/header'

const Page = () => {
    const navigate = useRouter();
    const buttonclick = () =>{
        navigate.push('/driver_hub')
    }
    return (
        <div className='bg-white h-screen'>
            <div className='bg-secondary'>
                <Header/>
            </div>
            <div>
                <div className='w-full flex flex-col justify-center items-center py-6'>
                    <h1 className='text-center'>Your ride is cancelled by User for some unexpected reason,<br></br> sorry for the inconvinience</h1>
                    <button className='bg-black p-2 text-white rounded-lg w-1/4 mt-4' onClick={buttonclick}>Go back</button>
                </div>

            </div>
        </div>
    )
}

export default Page
