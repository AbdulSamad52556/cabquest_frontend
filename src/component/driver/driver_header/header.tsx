'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import image from '../../../../public/static/WhatsApp_Image_2024-06-05_at_23.43.42_16f84c9f-removebg-preview.png'
import image2 from '../../../../public/static/bell.png'
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'
import httpClient from '@/app/httpClient'
import { Toaster, toast } from 'sonner'

const Header = () => {
  const navigate = useRouter();
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('daccessToken');
      if (token){

        const decodedToken = jwtDecode<any>(token || '');
        const email = decodedToken.sub;
        setEmail(email)
      }
      else{
        navigate.push('/login_driver')
      }
    }
  }, [navigate])

  const signOut = () => {

    const checknotificationpending = async () => {
      const response = await httpClient.post('booking/checknotificationpending', { 'email': email })
      console.log(response.data)
      if (response.data['message'] === 'pending') {
        toast.warning('A request is pending')
      } else if (response.data['message'] === 'ok') {
        const loc = { latitude: null, longitude: null }
        const response = await httpClient.post('auth/makeinactive', { email, loc })
      console.log(response.data)
      
      // if (response.data['message'] === 'ok' && response2.data['message'] === 'ok') {
        try {
          localStorage.removeItem('daccessToken')
          localStorage.removeItem('drefreshToken')
          localStorage.removeItem('dname')
          localStorage.removeItem('isdriver')
          localStorage.removeItem('isactive')
        }
        finally {
          navigate.push('/login_driver')
          const response2 = await httpClient.post('ride/liveloc', { 'email': email, 'coords': { 'lat': null, 'lng': null } })
        console.log(response2.data)
        }
        // }
      }
    }
    checknotificationpending();

  }

  return (
    <nav className="mx-auto flex max-w-full items-center justify-between p-4 lg:px-8" aria-label="Global">
      <div className='fixed'>
        <Toaster position='top-right' />
      </div>
      <div className="flex flex-1">
        <Link href="/" className="m-1.5 p-1.5">
          <Image className="h-6 md:h-10 w-auto" src={image} alt="example" />
        </Link>
      </div>
      <div className='flex items-center mr-5 md:mr-10 justify-end'>
        <button className='text-white text-sm md:text-xl ' onClick={signOut}>
          LogOut
        </button>
      </div>
      <div className='flex items-center justify-end cursor-pointer' onClick={() => navigate.push('/notification')}>
        <Image className='h-4 md:h-5 w-auto' src={image2} alt={'nothing'} />
      </div>
    </nav>
  )
}

export default Header
