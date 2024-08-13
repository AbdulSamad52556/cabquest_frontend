'use client'
import Header from '@/component/driver/driver_header/header'
import Vehicle_body from '@/component/driver/select_vehicle_body/vehicle_body'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import httpClient from '@/app/httpClient'
import { jwtDecode } from 'jwt-decode'

const Page = () => {
    const navigate = useRouter();
    const [spin, setSpin] = useState(false)


    const getemail = () =>{
        const token = localStorage.getItem('daccessToken');
    
        console.log('tokens: ',token)
        const decodedToken = jwtDecode(token!);
        const email = decodedToken.sub;
        return email
      }


    useEffect(()=>{
        try{
            const token = localStorage.getItem('isdriver')
            if (!token){
                navigate.push('/login_driver')
            }
        }
        catch{

        }

        const isVehicleadded = async() =>{
            const email = getemail();
            const response = await httpClient.post('auth/isvehicleadded',{'email':email})
            if (response.data['message'] === 'vehicle already added'){
              navigate.push('/verification_pending')
            }
            else{
                setSpin(true)

            }
          }
          isVehicleadded();
    },[navigate])

    if (!spin) {
        return (
          <div className='bg-white w-full h-screen flex justify-center items-center'>
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )
      }


    return (
        <div className='bg-white h-screen'>
            <div className='bg-secondary'>
                <Header />
            </div>
            <div>
            <Vehicle_body/>
            </div>
        </div>
    )
}

export default Page
