'use client'
import httpClient from '@/app/httpClient';
import Sidenav from '@/component/admin/side_nav/sidenav'
import React, { useCallback, useEffect, useState } from 'react'
import doc from '../../../../public/static/doc.png'
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface DriverVerification {
  id: number;
  providerName: string;
  vehicle: string;
  pan: string;
  dl: string;
  insurance: string;
  rc: string;
}

const page = () => {
  const [data, setData] = useState<DriverVerification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState<boolean>(false);
  const [spin, setSpin] = useState(false)
  const navigate = useRouter();

  const fetchData = useCallback(async () => { // Use useCallback to memoize the function
    try {
      setLoading(true);
      const response = await httpClient.get<DriverVerification[]>('auth/driver_verification');
      setData(response.data);
      setError(null);
      if (response.data) {
        setLoading(false);
      }
    } catch (error) {
      setError('Failed to fetch data');
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [fetchData, reload]);

  const handleDownload = async (fileName: string) => {
    window.open(`http://localhost:9639/${fileName}`, '_blank')
    // try {
    //   console.log(fileName)
    //   const response = await httpClient.get(`auth/${fileName}`, {
    //     responseType: 'blob', 
    //   });
    //   const url = window.URL.createObjectURL(new Blob([response.data]));
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.setAttribute('download', fileName);
    //   document.body.appendChild(link);
    //   link.click();
    //   link.parentNode?.removeChild(link);
    // } catch (error) {
    //   console.error('Error downloading file:', error);
    // }
  };

  const onAccept = async (id: number) => {
    try {
      const response = await httpClient.post('auth/accept', { id });
      setReload(prev => !prev); // Toggle the reload state to trigger useEffect
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

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

  if (!spin) {
    return (
      <div className='bg-white w-full h-screen flex justify-center items-center'>
        <ToastContainer />
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }
  return (
    <div className='flex bg-white'>
      <div>
        <Sidenav />
      </div>
      <div className='w-full '>

        <div className="container mx-auto py-10 px-5" >
          <div className="overflow-x-auto">
            {loading ?
              <div className='flex justify-center items-center h-full'>
                <span className="loading loading-dots loading-md"></span>
              </div>
              :
              <table className="text-sm bg-white text-black shadow-md w-full rounded-lg ">
                <thead>
                  <tr className="bg-territory text-white text-left">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Provider Name</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">PAN</th>
                    <th className="py-3 px-4">DL</th>
                    <th className="py-3 px-4">Insurance</th>
                    <th className="py-3 px-4">RC</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ?
                    <div className='flex justify-center items-center h-full'>
                      <span className="loading loading-dots loading-md"></span>
                    </div> : (
                      Array.isArray(data) &&
                      data.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-3 px-4">{item.id}</td>
                          <td className="py-3 px-4">{item.providerName}</td>
                          <td className="py-3 px-4">{item.vehicle}</td>
                          <td className="py-3 px-4">
                            <button onClick={() => handleDownload(item.pan)}>
                              <Image src={doc} alt='' />
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button onClick={() => handleDownload(item.dl)} >
                              <Image src={doc} alt='' />
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button onClick={() => handleDownload(item.insurance)} >
                              <Image src={doc} alt='' />
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button onClick={() => handleDownload(item.rc)}>
                              <Image src={doc} alt='' />
                            </button>
                          </td>
                          <td className="py-3 px-4 flex flex-col gap-2">
                            <div>
                              <button className="bg-primary-dark text-white py-1 px-4 rounded" onClick={() => onAccept(item.id)}>Accept</button>
                            </div>
                            <div>
                              <button className="bg-secondary-dark text-white py-1 px-4 rounded">Reject</button>
                            </div>
                          </td>
                        </tr>
                      )))
                  }
                </tbody>
              </table>
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default page
