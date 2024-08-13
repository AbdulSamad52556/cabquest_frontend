import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import image from '../../../../public/static/WhatsApp_Image_2024-06-05_at_23.43.42_16f84c9f-removebg-preview.png'
import { MailIcon } from '@heroicons/react/solid';


const Page = () => {
  return (
    <div className='bg-primary min-h-screen'>

      <nav className="mx-auto flex max-w-full items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="m-1.5 p-1.5">
            <Image className="h-10 w-auto" src={image} alt="example"/>
          </Link>
        </div>
      </nav>

      <div className='flex w-full justify-center align-center h-screen'>
        <div className='bg-primary md:w-1/2 h-4/6 flex  flex-row border border-white'>
          <div className='flex flex-col w-full md:w-full items-center justify-evenly md:m-3'>
            <h1 className='text-4xl text-white p-2'>Forget password</h1>
            <form>
              <div className='flex flex-col gap-5'>
                <div className="relative">
                  <input id='email' autoComplete='off'type="email" name="email" className='peer text-white border-b-2 outline-none bg-transparent p-2' placeholder='Enter your Email' />
                  <MailIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                </div>
                <button className='bg-white rounded-xl p-2'>Get OTP </button>
              </div>
            </form>
            <div className='h-10'>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
