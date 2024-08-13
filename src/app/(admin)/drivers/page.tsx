'use client'
import httpClient from '@/app/httpClient';
import Sidenav from '@/component/admin/side_nav/sidenav'
import React, { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ArrowCircleRightIcon } from '@heroicons/react/solid';

interface Driver {
  id: number;
  fullname: string;
  vehicle: string;
  email: string;
  phone: string;
  status: string;
}

const Page: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [spin, setSpin] = useState(false);
  const router = useRouter();
  const [input, setInput] = useState('');
  const navigate = useRouter();
  useEffect(() => {
    const fetching = async () => {
      setLoading(true);
      try {
        const response = await httpClient.get('auth/drivers');
        setDrivers(response.data);
        setFilteredDrivers(response.data); // Initialize filtered drivers
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetching();
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem('isadmin');
      if (token) {
        setSpin(true);
      } else {
        router.push('admin_login');
      }
    } catch {
      // Handle error if needed
    }
  }, [router]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
    // Filter drivers based on the input value
    const filtered = drivers.filter(driver =>
      driver.fullname.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDrivers(filtered);
  };

  if (!spin) {
    return (
      <div className='bg-white w-full h-screen flex justify-center items-center'>
        <Toaster />
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className='bg-white flex'>
      <div>
        <Sidenav />
      </div>
      <div className='w-full bg-white p-3 '>
      <div className='px-12 py-2'>
          <input
            type="text"
            className="px-4 text-black bg-gray-300 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            value={input}
            onChange={handleChange}
            placeholder="Search drivers..."
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
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">SALARY INFO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.length > 0 ? (
                      filteredDrivers.map((driver) => (
                        <tr key={driver.id} className="border-b text-gray-500 border-gray-200 text-center">
                          <td className="py-3 px-4">{driver.id}</td>
                          <td className="py-3 px-4">{driver.fullname}</td>
                          <td className="py-3 px-4">{driver.email}</td>
                          <td className="py-3 px-4">{driver.phone}</td>
                          <td className="py-3 px-4">{driver.status}</td>
                          <div className='flex flex-col items-center justify-center w-36 h-20 rounded-lg transition transform duration-300 ease-in-out scale-100 hover:scale-105 '>
                        <ArrowCircleRightIcon className="left-5 h-7 w-10 top-2 text-black hover:cursor-pointer" onClick={()=>navigate.push(`/salary_view?driver_id=${driver.id}`)}/>
                    </div>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-3 px-4 text-center">No drivers found</td>
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
  );
}

export default Page;
