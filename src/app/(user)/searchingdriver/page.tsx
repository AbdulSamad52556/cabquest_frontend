'use client'
import React, { Suspense, useEffect } from 'react'
import image from '../../../../public/static/Premium Vector _ People waiting for flight.jpeg'
import Image from 'next/image'
import Header2 from '@/component/user/header2/header2'
import reload from '../../../../public/static/Reload@1x-1.5s-200px-200px.gif'
import { useSearchParams } from 'next/navigation'
import httpClient from '@/app/httpClient'
import { useRouter } from 'next/navigation'

const Page = () => {
    const searchParams = useSearchParams()
    const navigate = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const checkride = async () => {
                const userid = searchParams.get('userid')
                const driverid = searchParams.get('driverid')
                const response = await httpClient.post('ride/checkride', { 'userid': userid })
                const response2 = await httpClient.post('booking/checknodriver', { 'userid': userid })
                console.log(response.data['message'])
                if (response.data['message'] === 'ridestarted') {
                    localStorage.setItem('rideid', response.data['rideid'])
                    navigate.push('/pickedup')
                }
                else if (response2.data['message'] === 'request is not accepted') {
                    navigate.push('/driver_not_available')
                }
            }
            const intervalId = setInterval(checkride, 1000);
            return () => clearInterval(intervalId);
        }
    }, [])

    return (
            <div className='bg-white h-screen'>
                <div className='bg-white'>
                    <Header2 />
                </div>
                <div className='flex flex-col md:flex-row w-full'>
                    <div className='flex w-full justify-center items-center'>
                        <Image src={reload} alt='' className='w-8 h-8' />
                        searching for your driver, please wait
                    </div>
                    <div className='flex w-full justify-center md:w-full md:justify-end'>
                        <Image src={image} alt='' />
                    </div>
                </div>
            </div>
    )
}

const SearchingDriverPage = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Page />
      </Suspense>
    );
  };
  
  export default SearchingDriverPage;