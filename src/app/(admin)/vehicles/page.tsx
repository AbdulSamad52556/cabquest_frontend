'use client'
import React, { useEffect, useState } from 'react';
import httpClient from '@/app/httpClient';
import Sidenav from '@/component/admin/side_nav/sidenav';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation'
import { DocumentAddIcon } from '@heroicons/react/solid'
import VehicleTypeForm from '@/component/admin/vehicletypeform/vehicletypeform';

interface Vehicle {
    id: number;
    type: string;
    base_price: string;
    base_distance_KM: number;
    price_per_KM: string;
}

const Page: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [spin, setSpin] = useState(false)
    const navigate = useRouter();
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [fetchve, setFetchve] = useState(true)

    useEffect(() => {

        if (!isFormVisible) {
            setFetchve(!fetchve)
        }
    }, [isFormVisible, fetchve])


    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await httpClient.get<Vehicle[]>('auth/vehicle');
                setVehicles(response.data);
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        fetchVehicles();
    }, [fetchve]);


    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
            const token = localStorage.getItem('isadmin')
            if (token) {
                setSpin(true)
            } else {
                navigate.push('admin_login')
            }
        }
        } catch {

        }
    }, [navigate])

    const addVehicle = () => {
        setIsFormVisible(!isFormVisible)
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
        <div className='flex relative bg-white justify-center'>
            <div className=''>
                <Sidenav />
            </div>
            <div className='w-full bg-white text-xs md:text-md p-5'>

                <div className="relative bg-white w-full py-10 z-1">
                    <div className="w-full mx-auto flex flex-col justify-center">
                        <div className='flex py-2 bg-territory w-1/5 justify-center items-center rounded-md mb-2 hover:cursor-pointer' onClick={addVehicle}>
                            {isFormVisible ?
                                <>
                                    <button className='bg-territory flex justify-between items-center rounded-md text-white px-10' >close form</button>
                                    <DocumentAddIcon className=" z-0 h-5 w-5 text-gray-100 peer-focus:text-blue-500" /></>
                                : <>
                                    <button className='bg-territory flex justify-between items-center rounded-md text-white px-10' >add vehicle </button>
                                    <DocumentAddIcon className=" z-0 h-5 w-5 text-gray-100 peer-focus:text-blue-500" /></>
                            }
                        </div>
                        {isFormVisible &&
                            <div className='absolute w-full top-1 p-5 bg-white bg-opacity-40'>
                                <div className='w-full h-full flex justify-end items-start'>

                                    <button onClick={()=>setIsFormVisible(false)} className='text-black text-xl'>X</button>
                                </div>
                                <div className='rounded-lg'>
                                    <VehicleTypeForm />
                                </div>

                            </div>}
                        <div className="overflow-x-auto bg-white ">
                            {loading ? (
                                <div className='flex justify-center items-center h-full'>
                                    <span className="loading loading-dots loading-md"></span>
                                </div>

                            ) : (
                                <table className="w-full bg-white shadow-lg rounded-lg overflow-auto">
                                    <thead>
                                        <tr className="bg-territory text-white text-center">
                                            <th className="py-3 px-4">ID</th>
                                            <th className="py-3 px-4">Vehicle Type</th>
                                            <th className="py-3 px-4">Base Price</th>
                                            <th className="py-3 px-4">Base Distance (KM)</th>
                                            <th className="py-3 px-4">Price per KM</th>
                                            <th className="py-3 px-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicles.map((vehicle, index) => (
                                            <tr key={index} className="border-b text-xs md:text-md text-gray-500 border-gray-200 text-center">
                                                <td className="md:py-3 md:px-4">{vehicle.id}</td>
                                                <td className="py-3 px-4">{vehicle.type}</td>
                                                <td className="py-3 px-4">{parseFloat(vehicle.base_price).toFixed(2)}</td>
                                                <td className="py-3 px-4">{vehicle.base_distance_KM}</td>
                                                <td className="py-3 px-4">{parseFloat(vehicle.price_per_KM).toFixed(2)}</td>
                                                <td className="py-3 px-4 flex">
                                                    <button className="bg-black text-white py-2 px-4 mr-2 rounded">edit</button><button className="bg-black text-white py-2 px-4 rounded">unlist</button>
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
    );
};

export default Page;
