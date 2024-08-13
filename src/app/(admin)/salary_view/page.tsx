'use client'
import httpClient from '@/app/httpClient'
import Sidenav from '@/component/admin/side_nav/sidenav'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Toaster, toast } from 'sonner'


interface Driver {
    id: number;
    vehicle: string;
    drop: string;
    km: number;
    payment_type: string;
    fare: number;
    date: Date;
    salary_status: string;
}

const Page: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const searchParams = useSearchParams()
    const [driverid, setDriverid] = useState(0)
    const [alert, setAlert] = useState('')


    useEffect(() => {
        const driver_id = searchParams.get('driver_id')
        setDriverid(parseInt(driver_id, 10))
        const getdata = async () => {
            const response = await httpClient.post('ride/getdata', { 'driver_id': driver_id })
            console.log(response.data)
            setDrivers(response.data)
        }
        getdata();
    }, [alert, searchParams])

    const sendsalary = async (e: React.MouseEvent<HTMLAnchorElement>, id: any, date: Date, fare: any) => {
        e.preventDefault()
        const data = {
            'driverid': driverid,
            'rideid': id,
            'date': date,
            'fare': fare

        }
        console.log(data)
        const response = await httpClient.post('ride/sendsalary', data)
        if (response.data['message'] === 'success'){
            setAlert('alerted')
            toast.success( 'salary credited');
        }
    }

    const deductamount = async (e: React.MouseEvent<HTMLAnchorElement>, id: any, date: Date, fare: any) => {
        e.preventDefault()
        const data = {
            'driverid': driverid,
            'rideid': id,
            'date': date,
            'fare': fare

        }
        const response = await httpClient.post('ride/deductamount', data)
        if (response.data['message'] === 'success'){
            setAlert('alerted')
            toast.success( 'amount deducted');
        }
    }   

    const formatDate = (dateString) => {
        // Parse the date string into a Date object
        const date = new Date(dateString);
      
        // Format the date to 'YYYY-MM-DD'
        return date.toLocaleDateString('en-GB'); // 'en-GB' format gives 'dd/mm/yyyy'
      };

    return (
        <div className='bg-white flex'>
            <Toaster position='top-right' richColors/>
            <div>
                <Sidenav />
            </div>
            <div className=" bg-gray-100 p-8 w-full ">
                <div className=" bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Salary Information</h1>
                    <h2 className="text-xl text-end font-bold mb-6 text-gray-800">Total deduction: ₹ {drivers[drivers.length - 1]}</h2>
                    <div className="overflow-x-auto">
                        <table className="max-w-full bg-white divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KM</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {drivers.map((item) => (
                                    item.id &&
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.vehicle}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.drop}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.km}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.payment_type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.fare}</td>
                                        {!item.salary_status ?
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.payment_type === 'Online' ?
                                                    <a href="" className='bg-secondary p-2 rounded-md text-white' onClick={(e) => sendsalary(e, item.id, item.date, item.fare)}>Send salary</a>
                                                    :
                                                    <a href="" className='bg-secondary p-2 rounded-md text-white' onClick={(e) => deductamount(e, item.id, item.date, item.fare)}>Deduct amount</a>
                                                }
                                            </td> :
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.salary_status === 'credited' ?
                                                    <p>Credited</p> :
                                                    <p>Deducted</p>}
                                            </td>
                                        }

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
