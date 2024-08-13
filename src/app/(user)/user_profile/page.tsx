'use client'
import httpClient from '@/app/httpClient'
import Header from '@/component/user/header/header'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Trip {
    id: number;
    driver_name: string;
    vehicle: string;
    pickup: string;
    drop: string;
    km: number;
    fare: number;
    date: string; 
  }

const Page :  React.FC = ()=> {
    const [data, setDate] = useState<Trip[]>([])
    const navigate = useRouter();
    useEffect(() => {
        const gettripuser = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const decodedToken = jwtDecode(token);
                const email = decodedToken.sub;
                const response = await httpClient.post('ride/gettripuser', { 'email': email })
                setDate(response.data['data'])
            }
            else{
                navigate.push('/')
            }
        }
        gettripuser();
    }, [navigate])


    return (
        <div className='bg-white h-screen'>
            <div className='bg-primary'>
                <Header />
            </div>

            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-7xl mx-auto bg-white p-2 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Trip Details</h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pick-Up</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KM</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((trip) => (
                                    <tr key={trip.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.driver_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.vehicle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{trip.pickup}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.drop}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.km}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{trip.fare}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>




        </div>
    )
}

export default Page
