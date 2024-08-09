'use client'
import httpClient from '@/app/httpClient';
import Header from '@/component/driver/driver_header/header'
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react'

const Page = () => {
    const salaryDetails = {
        baseSalary: 0,
        bonus: 0,
        deductions: 0,
        netSalary: 0,
    };

    // useEffect(()=>{
    //     const getrides = async() =>{

    //         const token = localStorage.getItem('daccessToken');
    //         if (token) {
    //             const decodedToken = jwtDecode(token);
    //             const email = decodedToken.sub;
    //             const response = await httpClient.post('ride/getrides',{'email':email})
    //         }
    //     }
    //     getrides();
    // }, [])

    return (
        <div className='bg-secondary'>
            <div>
                <Header />
            </div>
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md shadow-black">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Salary Information</h1>

                    <div className="flex flex-col space-y-4">
                        <div className="bg-gray-200 p-4 rounded-lg shadow-md shadow-black">
                            <h2 className="text-xl font-bold text-gray-700 mb-3 text-center">Current Amount</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Balance Amount:</span>
                                    <span className="text-gray-800">₹{salaryDetails.baseSalary.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Incentive:</span>
                                    <span className="text-gray-800">₹{salaryDetails.bonus.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Deductions:</span>
                                    <span className="text-gray-800">-₹{salaryDetails.deductions.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span className="text-gray-600">Total Amount:</span>
                                    <span className="text-gray-800">₹{salaryDetails.netSalary.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-200 p-4 rounded-lg shadow-md shadow-black">
                            <h2 className="text-xl font-bold text-gray-700 mb-3 text-center">Salary History</h2>
                            <ul className="space-y-2">
                                <li className="flex justify-between">
                                    <span className="text-gray-600">Ride Count</span>
                                    <span className="text-gray-600">Total Amount</span>
                                    <span className="text-gray-600">Incentive</span>
                                    <span className="text-gray-800">Status</span>
                                </li>
                                {/* <li className="flex justify-between">
                                    <span className="text-gray-600">Bonus:</span>
                                    <span className="text-gray-800">${salaryDetails.bonus.toLocaleString()}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-600">Deductions:</span>
                                    <span className="text-gray-800">-${salaryDetails.deductions.toLocaleString()}</span>
                                </li>
                                <li className="flex justify-between font-bold">
                                    <span className="text-gray-600">Net Salary:</span>
                                    <span className="text-gray-800">${salaryDetails.netSalary.toLocaleString()}</span>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Page
