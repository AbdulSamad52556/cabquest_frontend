'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import image from '../../../../public/static/WhatsApp_Image_2024-06-05_at_23.43.42_16f84c9f-removebg-preview.png'
import image2 from '../../../../public/static/bell.png'
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'
import httpClient from '@/app/httpClient'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const navigate = useRouter();

  const signOut = () =>{
 
    const token = localStorage.getItem('daccessToken');
    const decodedToken = jwtDecode(token);
    const email = decodedToken.sub;
    const checknotificationpending = async() =>{
      const response = await httpClient.post('booking/checknotificationpending',{'email':email})
      if (response.data['message'] === 'pending'){
        toast('A request is pending', { type: 'warning', theme: 'dark', hideProgressBar: true, pauseOnHover: false })
      }else if(response.data['message'] === 'ok'){
        localStorage.removeItem('daccessToken')
        localStorage.removeItem('drefreshToken')
        localStorage.removeItem('dname')
        localStorage.removeItem('isdriver')
        try{
          localStorage.removeItem('isactive')
        }
        catch{
        }
        finally{
          navigate.push('/login_driver')
        }

      }
    }
    checknotificationpending();

  }

  return (
    <nav className="mx-auto flex max-w-full items-center justify-between p-4 lg:px-8" aria-label="Global">
      <ToastContainer/>
        <div className="flex flex-1">
          <Link href="/" className="m-1.5 p-1.5">
            <Image className="h-6 md:h-10 w-auto" src={image} alt="example"/> 
          </Link>
        </div>
        <div className='flex items-center mr-5 md:mr-10 justify-end'>
          <button className='text-white text-sm md:text-xl ' onClick={signOut}>
          LogOut
          </button>
          </div>
        <div className='flex items-center justify-end cursor-pointer' onClick={()=>navigate.push('/notification')}>
            <Image className='h-4 md:h-5 w-auto' src={image2} alt={'nothing'} />
          </div>
      </nav>
  )
}

export default Header
