'use client'
import Sidenav from '@/component/admin/side_nav/sidenav'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer } from 'react-toastify';
import httpClient from '@/app/httpClient';

interface Ride {
  id: number;
  userid: number;
  driverid: number;
  vehicle: string;
  pickup: string;
  drop: string;
  km: Float32Array;
  status: string;
  fare: Float32Array;
  date: string;
}

const Page = () => {
  const navigate = useRouter();
  const [spin, setSpin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rides, setRide] = useState<Ride[]>([])

  useEffect(() => {
    try {
      const token = localStorage.getItem('isadmin')
      if (token) {
        setSpin(true)
      } else {
        navigate.push('admin_login')
      }
    } catch {

    }
  }, [])

  useEffect(() => {
    const fetchride = async () => {
      const response = await httpClient.get('ride/fetchride')
      setRide(response.data)
      setLoading(false)
    }
    fetchride();
  }, [])

  if (!spin) {
    return (
      <div className='bg-white w-full h-screen flex justify-center items-center'>
        <ToastContainer />
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }
  return (
    <div className='bg-white flex'>
      <div>
        <Sidenav />
      </div>
      <div className='w-full flex flex-col px-5 py-10'>
        {loading ?
          (<div className='flex items-center justify-center h-1/4'>
            <span className="loading loading-dots loading-md"></span>
          </div>)
          :
          (<table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-territory text-white text-center">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">USERID</th>
                <th className="py-3 px-4">DRIVERID</th>
                <th className="py-3 px-4">VEHICLE</th>
                <th className="py-3 px-4">PICKUP</th>
                <th className="py-3 px-4">DROP</th>
                <th className="py-3 px-4">KM</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">FARE</th>
                <th className="py-3 px-4">DATE</th>
              </tr>
            </thead>
            <tbody>
            {Array.isArray(rides) &&
              rides.map((ride, index) => (
                <tr className="border-b text-gray-800 border-gray-200 text-center text-sm">
                  <td className="py-3 px-4">{ride.id}</td>
                  <td className="py-3 px-4">{ride.userid}</td>
                  <td className="py-3 px-4">{ride.driverid}</td>
                  <td className="py-3 px-4">{ride.vehicle}</td>
                  <td className="py-3 px-4">{ride.pickup}</td>
                  <td className="py-3 px-4">{ride.drop}</td>
                  <td className="py-3 px-4">{ride.km}</td>
                  <td className="py-3 px-4">{ride.status}</td>
                  <td className="py-3 px-4">{ride.fare}</td>
                  <td className="py-3 px-4">{ride.date}</td>
                </tr>
              ))}
            </tbody>
          </table>)}
      </div>
    </div>
  )
}

export default Page
