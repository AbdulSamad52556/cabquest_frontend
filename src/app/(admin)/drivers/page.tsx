'use client'
import httpClient from '@/app/httpClient';
import Sidenav from '@/component/admin/side_nav/sidenav'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation'

interface Driver {
  id: number;
  fullname: string;
  vehicle: string;
  email: string;
  phone: string;
  status: string;
}

const page = () => {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState<Driver[]>([]);
  const [spin, setSpin] = useState(false)
  const navigate = useRouter();
  const [input, setInput] = useState('')

  useEffect(() => {
    const fetching = async () => {
      setLoading(true);
      try {
        const response = await httpClient.get('auth/drivers');
          setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetching();
  }, [search]);


  useEffect(()=>{
    try{
      const token = localStorage.getItem('isadmin')
      if(token){
        setSpin(true)
      }else{
        navigate.push('admin_login')
      }
    }catch{

    }
  },[])

  const handlechange = async()=>{
    const response = await httpClient.post('auth/searchdriver',{'val':input})
    setSearch(response.data);
  }

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
      <div className='w-full bg-white p-3 '>

      <input type="text" onChange={handlechange} className="px-4 text-black bg-gray-300 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none "/>

        <div className="container px-5 mx-auto py-10">
          <div className="overflow-x-auto">
            <div className="flex justify-center">
              {loading ? (
                <div className='flex justify-center items-center h-full'>
                  <span className="loading loading-dots loading-md"></span>
                </div>

              ) : (
                <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-territory text-white text-center">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">FULLNAME</th>
                      {/* <th className="py-3 px-4">VEHICLE</th> */}
                      <th className="py-3 px-4">EMAIL</th>
                      <th className="py-3 px-4">PHONE</th>
                      <th className="py-3 px-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((driver, index) => (
                      <tr key={index} className="border-b text-gray-500 border-gray-200 text-center">
                        <td className="py-3 px-4">{driver.id}</td>
                        <td className="py-3 px-4">{driver.fullname}</td>
                        {/* <td className="py-3 px-4">null</td> */}
                        <td className="py-3 px-4">{driver.email}</td>
                        <td className="py-3 px-4">{driver.phone}</td>
                        <td className="py-3 px-4">{driver.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
