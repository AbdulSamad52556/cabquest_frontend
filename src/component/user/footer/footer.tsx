import React from 'react'
import Image from 'next/image'
import image from '../../../../public/static/WhatsApp_Image_2024-06-05_at_23.43.42_16f84c9f-removebg-preview.png'
const Footer = () => {
  return (
    <div className='bg-primary h-50vh p-2'>
        <div className='w-2/6 md:w-1/6 lg:w-1/6 p-5'> 

        <Image src={image} alt=''/>
        </div>
      
    </div>
  )
}

export default Footer
