'use client'
import Header from '@/component/driver/driver_header/header'
import React, { useEffect, useState } from 'react'
import { ArrowCircleLeftIcon } from '@heroicons/react/solid';
import httpClient from '@/app/httpClient';
import { jwtDecode } from 'jwt-decode';
import { ArrowCircleDownIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/navigation';

interface Ride {
    location: string;
    fare: string;
    date: string;
}

interface WeeklyData {
    [key: string]: Ride[];
}

const initialData: WeeklyData = {
    'Sunday': [],
    'Monday': [],
    'Tuesday': [],
    'Wednesday': [],
    'Thursday': [],
    'Friday': [],
    'Saturday': []
};

const Page: React.FC = () => {
    const [total, setTotal] = useState(0)
    const [today, setToday] = useState(0)
    const [dailyincentive, setDailyincentive] = useState(0)
    const [weeklyincentive, setWeeklyincentive] = useState(0)
    const [openDay, setOpenDay] = useState<string | null>(null); // Manage which day is open
    const [weeklydata, setWeeklydata] = useState<WeeklyData>(initialData);
    const navigate = useRouter();
    const toggleAccordion = (day: string) => {
        setOpenDay(openDay === day ? null : day);
    };

    useEffect(() => {
        const weeklyearnings = async () => {
            const token = localStorage.getItem('daccessToken');
            if (token) {
                const decodedToken = jwtDecode(token);
                const email = decodedToken.sub;
                const response = await httpClient.post('ride/weeklyearnings', { 'email': email })
                setTotal(response.data['message'])
                setToday(response.data['today'])
                setWeeklydata(response.data['data']);
                console.log(response.data['data'])
                if (response.data['today'] > 999) {
                    setDailyincentive(response.data['today'] + 200)
                }
                if (response.data['total'] > 7000) {
                    setWeeklyincentive(response.data['total'] + 1400)
                }   
            }
            else{
                navigate.push('/driver_hub')
            }
        }
        weeklyearnings();
    }, [navigate])

    return (
        <div className='bg-secondary min-h-screen'>
            <div>
                <Header />
            </div>
            <div>
                <div className='flex gap-2 w-full justify-between p-5'>
                    <div className='flex'>
                        <ArrowCircleLeftIcon className="left-5 h-7 w-10 top-2 text-white hover:cursor-pointer" />
                        <h1 className='text-white font-bold text-xl'>Weekly Earnings Details</h1>
                    </div>
                    <div onClick={()=>navigate.push('/salary_info')}>
                        <h1 className='text-gray-200 font-bold text-lg text-center cursor-pointer'>Salary Info</h1>
                    </div>
                </div>
                <div className='flex gap-2 md:gap-5 lg:gap-10 justify-center p-2 my-10'>
                    <div className='w-60 bg-secondary h-24 md:h-32 flex flex-col items-center rounded-lg border-2 border-blue-400'>
                        <h1 className='text-white text-sm text-center md:font-semibold mt-2 md:mt-4'>Total Earnings</h1>
                        <h1 className='text-white text-xl text-center md:font-semibold mt-2 md:mt-4'>₹ {total}</h1>
                    </div>
                    <div className='w-60 bg-secondary h-24 md:h-32 flex flex-col items-center rounded-lg border-2 border-blue-400'>
                        <h1 className='text-white text-sm text-center md:font-semibold mt-2 md:mt-4'>Today's Earnings</h1>
                        <h1 className='text-white text-xl text-center md:font-semibold mt-2 md:mt-4'>₹ {today}</h1>
                    </div>
                    <div className='w-60 bg-secondary h-24 md:h-32 flex flex-col items-center rounded-lg border-2 border-blue-400'>
                        <h1 className='text-white text-sm text-center md:font-semibold mt-2 md:mt-4'>Daily Incentive</h1>
                        <h1 className='text-white text-xl text-center md:font-semibold mt-2 md:mt-4'>₹ {dailyincentive}</h1>
                    </div>
                    <div className='w-60 bg-secondary h-24 md:h-32 flex flex-col items-center rounded-lg border-2 border-blue-400'>
                        <h1 className='text-white text-sm text-center md:font-semibold mt-2 md:mt-4'>Total Incentive</h1>
                        <h1 className='text-white text-xl text-center md:font-semibold mt-2 md:mt-4'>₹ {weeklyincentive}</h1>
                    </div>
                </div>

                {Object.keys(weeklydata).map(day => {
                    const hasRides = weeklydata[day].length > 0;

                    return (
                        hasRides && (
                            <div key={day} className="flex flex-col items-center mb-4">
                                <div
                                    className="w-full md:w-1/2 lg:w-1/3 bg-secondary h-20 flex justify-center items-center rounded-lg border-2 border-blue-400 cursor-pointer"
                                    onClick={() => toggleAccordion(day)}
                                >
                                    <div className='flex justify-around w-full'>

                                        <h2 className="text-white font-semibold">
                                            {day}
                                        </h2>
                                        <h2 className="text-white font-semibold">{weeklydata[day].length > 0 ? weeklydata[day][0].date : 'No rides'}</h2>
                                        <ArrowCircleDownIcon className={`w-6 h-6 ${openDay ? 'transform rotate-180' : ''}`} />
                                    </div>

                                </div>
                                {openDay === day && (
                                    <div
                                        className={`w-full md:w-1/2 lg:w-1/3 bg-white p-4 rounded-lg border-2 border-blue-400 mt-2 transition-transform duration-300 ease-out ${openDay === day ? 'scale-y-100' : 'scale-y-0'} origin-top`}
                                        style={{ transformOrigin: 'top' }}
                                    >
                                        <ul>
                                            {weeklydata[day].map((ride, index) => (
                                                <li key={index} className='border-b-2 border-gray-200 text-black p-2'>
                                                    <div className='flex justify-between'>
                                                        <p>{ride.location}</p>
                                                        <p> ₹ {ride.fare}</p>
                                                    </div>
                                                    <p>{new Date(ride.date).toLocaleString()}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                            </div>
                        )
                    );
                })}

            </div>
        </div>
    )
}

export default Page

