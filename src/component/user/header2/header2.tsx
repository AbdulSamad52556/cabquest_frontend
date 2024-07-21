'use client'
import React,{useEffect, useState} from 'react'
import image2 from '../../../../public/static/WhatsApp_Image_2024-06-06_at_10.26.33_b4404c62-removebg-preview.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

const Header2 = () => {
    const navigate = useRouter();

    const handleclick = () =>{
        navigate.push('/')
    }

    return (
        <div className='flex gap-5'>
            <div className='p-10' onClick={handleclick}>
                <Image className="h-10 w-auto" src={image2} alt="example" />
            </div>
            <div className='p-14'>
                <h1 className='text-black font-bold underline'>Ride</h1>
            </div>
        </div>
    )
}

export default Header2
