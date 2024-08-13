'use client'
import React, { useEffect } from 'react'
import image from '../../../../public/static/Premium Vector _ People waiting for flight.jpeg'
import Image from 'next/image'
import Header2 from '@/component/user/header2/header2'
import { useRouter } from 'next/navigation'


const Page = () => {
    const navigate = useRouter()
    
    return (
        <div className='bg-white h-screen'>
            <div className='bg-white'>
                <Header2 />
            </div>

            <div className='flex flex-col md:flex-row w-full'>
                <div className='flex flex-col md:flex-row w-full justify-center items-center p-2'>
                    <h1 className='text-sm md:text-md lg:text-xl'>We can't found any driver, sorry for the inconvenience</h1>
                    <div className='p-2 md:p-4 w-fit ml-2 rounded-md bg-black text-white' onClick={()=>{navigate.push('/ride')}}>
                        <button className='text-sm '>
                            Go Back
                        </button>
                    </div>
                </div>
                <div className='flex w-full justify-center md:w-1/2 md:justify-end'>
                    <Image src={image} alt='' />
                </div>
            </div>

        </div>
    )
}

export default Page
