'use client'
import Sidenav from '@/component/admin/side_nav/sidenav'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer } from 'react-toastify';
import httpClient from '@/app/httpClient';

interface User {
  id: number ;
  fullname: string ;
  email: string ;
  phone: string ;
}

const page = () => {
  const navigate = useRouter();
  const [spin, setSpin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUser] = useState<User[]>([])

  useEffect(() => {
    try {
      const token = localStorage.getItem('isadmin')
      if (token) {
        setSpin(true)
      } else {
        navigate.push('/admin_login')
      }
    } catch {

    }
  }, [])

  useEffect(() => {
    const fetchride = async () => {
      const response = await httpClient.get('auth/users')
      setUser(response.data)
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
      <div className='w-full bg-white p-3 '>

        <input type="text" className="px-4 text-black bg-gray-300 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none " />

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
                      <th className="py-3 px-4">EMAIL</th>
                      <th className="py-3 px-4">PHONE</th>
                      <th className="py-3 px-4">ACTION</th>
                    </tr>
                  </thead> 
                  <tbody>
                    {Array.isArray(users) &&
                    users.map((user, index) => (
                      <tr key={index} className="border-b text-gray-500 border-gray-200 text-center">
                        <td className="py-3 px-4">{user.id}</td>
                        <td className="py-3 px-4">{user.fullname}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.phone}</td>
                        <td className=" ">
                          <div>
                          <button>block</button>
                          </div>
                          <div>
                          <button>unblock</button>
                          </div>
                        </td>
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
