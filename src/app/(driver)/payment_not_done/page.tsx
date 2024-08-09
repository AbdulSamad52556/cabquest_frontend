'use client'
import Header from '@/component/driver/driver_header/header'
import React, { useEffect, useState } from 'react'
import image from '../../../../public/static/error.jpg'
import Image from 'next/image'
import { jwtDecode } from 'jwt-decode'
import httpClient from '@/app/httpClient'
import { useRouter } from 'next/navigation';


const Page = () => {
  const [price, setPrice] = useState<number | null>(null)
  const [rideid, setRideid] = useState(0)
  const [payment, setPayment] = useState(false)
  const [demail, setEmail] = useState<String | null >('')
  const navigate = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('daccessToken');
    if (token) {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub!;
        setEmail(email)
        const getride = async () => {
            const response = await httpClient.post('ride/getride', { 'email': email })
            setRideid(response.data['ride']['id'])
            const fare = parseInt(response.data['ride']['fare'], 10) + 30
            console.log(fare)
            setPrice(fare)
        }
        getride();
    }

}, [])

  const ispayed = async() =>{
    const response = await httpClient.post('ride/ispayed',{'rideid':rideid})
    if (response.data['message'] === 'payment done'){
      navigate.push('/driver_hub')
      return
    }
  }

  const paymentconfirm = async() =>{
    const response = await httpClient.post('ride/paymentconfirm', {'rideid':rideid})
    if (response.data['message'] === 'ok'){
      const response2 = await httpClient.post('booking/ridefinish',{'email':demail})
      if (response2.data['message'] === 'success'){
        navigate.push('/driver_hub')
      }
    }
  }

  useEffect(()=>{
    const intervalId = setInterval(ispayed, 1000);
    return () => clearInterval(intervalId);
  },[])

  return (
    <div className='bg-black h-screen'>
      <div className='bg-black z-10'>
        <Header />
      </div>
      <div className='flex flex-col items-center'>
        <Image className='w-52 relative z-0 -mt-8' src={image} alt=''/>
        <h1 className='absolute text-2xl text-white z-1 mt-10'>Waiting for the payment ...</h1>
        <button className='p-2 bg-primary-dark text-white w-1/2 -mt-10 z-10 rounded-md text-sm md:text-xl hover:bg-blue-800' onClick={()=>setPayment(true)}>
          paid by cash
        </button>
      </div>
      <div className='flex justify-center z-10 -mt-10'>
      </div>

      {payment &&
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-black">payment is confirmed by driver</h2>
        <h1 className="text-2xl text-center font-bold mb-4 text-black">₹ {price}</h1>
        <div className="flex justify-center gap-4">
          <button
            onClick={paymentconfirm}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            YES
          </button>
          <button
            onClick={()=>setPayment(false)}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-500"
          >
            NO
          </button>
        </div>
      </div>
    </div>}


    </div>
  )
}

export default Page
