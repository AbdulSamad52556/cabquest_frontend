// page.tsx (Client Component)
'use client'; // Ensure this is marked as a client component

import httpClient from '@/app/httpClient';
import Sidenav from '@/component/admin/side_nav/sidenav';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'sonner';

interface Driver {
    id: number;
    vehicle: string;
    drop: string;
    km: number;
    payment_type: string;
    fare: number;
    date: Date;
    salary_status: string | null;
}

const Page: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const searchParams = useSearchParams();
    const [driverid, setDriverid] = useState<number>(0);
    const [alert, setAlert] = useState<string>('');
    const [deduction, setDeduction] = useState<number>(0);

    useEffect(() => {
        const driver_id = searchParams.get('driver_id');
        if (driver_id !== null) {
            setDriverid(parseInt(driver_id, 10));
        }

        const getdata = async () => {
            try {
                const response = await httpClient.post('ride/getdata', { 'driver_id': driver_id });
                console.log(response.data);
                setDeduction(response.data[response.data.length - 1]);
                setDrivers(response.data);
            } catch (error) {
                toast.error('Failed to fetch data');
            }
        };

        getdata();
    }, [alert, searchParams]);

    const sendsalary = async (e: React.MouseEvent<HTMLAnchorElement>, id: any, date: Date, fare: any) => {
        e.preventDefault();
        const data = {
            'driverid': driverid,
            'rideid': id,
            'date': date,
            'fare': fare
        };
        try {
            const response = await httpClient.post('ride/sendsalary', data);
            if (response.data['message'] === 'success') {
                setAlert('alerted');
                toast.success('Salary credited');
            }
        } catch (error) {
            toast.error('Failed to send salary');
        }
    };

    const deductamount = async (e: React.MouseEvent<HTMLAnchorElement>, id: any, date: Date, fare: any) => {
        e.preventDefault();
        const data = {
            'driverid': driverid,
            'rideid': id,
            'date': date,
            'fare': fare
        };
        const response = await httpClient.post('ride/deductamount', data);
        if (response.data['message'] === 'success') {
            setAlert('alerted');
            toast.success('Amount deducted');
        }
    };

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    return (
        <div className='bg-white flex'>
            <Toaster position='top-right' richColors />
            <div>
                <Sidenav />
            </div>
            <div className="bg-gray-100 p-8 w-full">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Salary Information</h1>
                    <h2 className="text-xl text-end font-bold mb-6 text-gray-800">Total deduction: ₹ {deduction}</h2>
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
};

const SalaryViewPage = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Page />
      </Suspense>
    );
  };
  
  export default SalaryViewPage;