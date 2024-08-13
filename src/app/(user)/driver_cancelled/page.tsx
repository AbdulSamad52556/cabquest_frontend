'use client'
import Header2 from '@/component/user/header2/header2'
import React from 'react'
import { useRouter } from 'next/navigation'

const Page = () => {
    const navigate = useRouter();
    const buttonclick = () =>{
        navigate.push('/ride')
    }
    return (
        <div className='bg-white h-screen'>
            <div>
                <Header2></Header2>
            </div>
            <div>
                <div className='w-full flex flex-col justify-center items-center py-6'>
                    <h1 className='text-center'>Your ride is cancelled by your driver for some unexpected reason,<br></br> sorry for the inconvinience</h1>
                    <button className='bg-black p-2 text-white rounded-lg w-1/4 mt-4' onClick={buttonclick}>click here to Book Again</button>
                </div>

            </div>
        </div>
    )
}

export default Page
