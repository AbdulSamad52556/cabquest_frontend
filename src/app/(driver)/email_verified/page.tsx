import Image from 'next/image'
import React from 'react'
import image from '../../../../public/static/email (3).png'
import { ArrowDownIcon } from '@heroicons/react/solid'
import Link from 'next/link'

const Page = () => {
  return (
    <div className='flex w-full h-screen justify-center items-center'>
        <div className='w-3/4 md:w-2/4 h-3/5 md:h-3/4 bg-primary-light flex flex-col items-center p-10 gap-10 rounded-md'>

      <Image src={image} alt='' className='w-20 md:w-32 lg:w-40 md:w-100'/>
      <h1 className='text-xl text-center text-green-700 font-semibold'>Your email verified successfully</h1>
      <h1>click here to login</h1>
      <ArrowDownIcon className='w-10'/>
      <Link href={'/login_driver'}>
      <button className='bg-secondary text-white px-20 py-1 rounded-md'>login</button>
      </Link>
        </div>
    </div>
  )
}

export default Page
