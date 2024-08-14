'use client'
import Sidenav from '@/component/admin/side_nav/sidenav'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer } from 'react-toastify'
import httpClient from '@/app/httpClient'

interface User {
  id: number
  fullname: string
  email: string
  phone: string
}

const Page: React.FC = () => {
  const router = useRouter()
  const [spin, setSpin] = useState(true)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]) // State to store filtered users
  const [query, setQuery] = useState('')

  useEffect(() => {
    const checkToken = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('isadmin')
        if (!token) {
          router.push('/admin_login')
        } else {
          setSpin(false)
        }
      }
    }
      checkToken()
    }, [router])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await httpClient.get('auth/users')
        setUsers(response.data)
        setFilteredUsers(response.data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
    setFilteredUsers(users.filter(user =>
      user.fullname.toLowerCase().includes(value.toLowerCase())
    ))
  }

  if (spin) {
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
      <div className='w-full bg-white p-3'>
        <div className='px-12 py-2'>
          <input
            type="text"
            className="px-4 text-black bg-gray-300 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            value={query}
            onChange={handleSearch}
            placeholder="Search users..."
          />
        </div>

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
                      {/* <th className="py-3 px-4">STATUS</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b text-gray-500 border-gray-200 text-center">
                          <td className="py-3 px-4">{user.id}</td>
                          <td className="py-3 px-4">{user.fullname}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.phone}</td>
                          {/* <td>
                            <button className="bg-black text-white py-2 px-4 mr-2 rounded">Block</button>
                            <button className="bg-black text-white py-2 px-4 rounded">Unblock</button>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-3 px-4 text-center">No users found</td>
                      </tr>
                    )}
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

export default Page
