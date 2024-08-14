'use client'
import Sidenav from '@/component/admin/side_nav/sidenav'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'
import { Chart as ChartJS, Title, BarElement, LineElement, CategoryScale, LinearScale } from 'chart.js';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'; // Verify if GoogleMap is available here
import httpClient from '@/app/httpClient'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale);

interface Markers {
    lat: number;
    lng: number;
}

interface MonthlyFare {
    month: string;
    value: number;
}

interface WeeklyData {
    week: string;
    value1: number;
    value2: number;
}

const Page: React.FC = () => {
    const navigate = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [markers, setMarkers] = useState<Markers[]>([]);
    const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
    const [monthlyFares, setMonthlyFares] = useState<MonthlyFare[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [dailyprofit, setDailyProfit] = useState<number>(0)
    const [booking, setBooking] = useState({cancelled:0, accepted:0})
    const [trip, setTrip] = useState({accepted:0, cancelled:0})
    const [vehicles, setVehicles] = useState({active:0, inactive:0})
    const [years, setYears] = useState<number[]>([]);
    const [total, setTotal] = useState(0)
    const [total_profit, setTotalProfit] = useState(0)

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const startYear = 2023;
        const yearOptions: number[] = [];

        for (let year = startYear; year <= currentYear; year++) {
            yearOptions.push(year);
        }

        setYears(yearOptions);

        fetchData(selectedYear);
    }, [selectedYear]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
        const a_tokens = localStorage.getItem('aaccessToken');
        const aloading = localStorage.getItem('aloading');
        if (!a_tokens) {
            navigate.push('/admin_login');
        } else {
            setLoading(true);
        }
        if (aloading) {
            toast.success(aloading);
            const timer = setTimeout(() => {
                localStorage.removeItem('aloading');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }
    }, [navigate]);

    useEffect(() => {
        setMapLoaded(true);
    }, []);

    useEffect(() => {
        const get_weekly_data = async () => {
            const response = await httpClient.get('ride/get_weekly_data')
            setWeeklyData(response.data['message'])
            console.log(response.data['message'])
        }
        get_weekly_data();
    }, [])

    useEffect(()=>{
        const bookingcount = async() =>{
            const response = await httpClient.get('booking/bookingcount')
            setBooking(response.data)
        }
        bookingcount();
    }, [])

    useEffect(() => {
        const fetchLive = async () => {
            try {
                const response = await httpClient.get('ride/fetchlive');
                const latlng = response.data.map((item: any) => ({
                    lat: Number(item['lat']),
                    lng: Number(item['lng'])
                }));
                console.log(latlng)
                setMarkers(latlng);
            } catch (error) {
                console.error("Error fetching live data:", error);
            }
        }
        fetchLive();
    }, []);

    useEffect(()=>{
        const dailyprofit = async () =>{
            const response = await httpClient.get('ride/dailyprofit')
            setDailyProfit(response.data['message'])
            setTrip({accepted:response.data['accepted'], cancelled:response.data['cancelled']})
            setTotal(response.data['total'])
            setTotalProfit(response.data['total_profit'])
        }
        dailyprofit();
    },[])

    useEffect(()=>{
        const vehicles = async() =>{
            const response = await httpClient.get('booking/vehicles')
            setVehicles({active: response.data['total'], inactive: response.data['inactive']})
        }
        vehicles();
    },[])



    const fetchData = async (year: number) => {
        try {
            const response = await httpClient.get(`ride/monthly_fares/${year}`);
            console.log(response.data)
            setMonthlyFares(response.data);
        } catch (error) {
            console.error("Error fetching monthly fares:", error);
        }
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = parseInt(event.target.value, 10);
        setSelectedYear(year);
        fetchData(year);
    };

    if (!loading) {
        return (
            <div className='bg-white w-full h-screen flex justify-center items-center'>
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className='flex bg-white'>
            <Toaster position='top-right' richColors/>
            <div>
                <Sidenav />
            </div>
            <div className='flex-1 p-10'>
                <div className='flex space-x-5 justify-center mb-10 '>
                    <div className='border-2 border-gray-100 w-36 h-20 rounded-lg  shadow-xl transition transform duration-300 ease-in-out scale-100 hover:scale-105 hover:shadow-2xl'>
                        <div>
                            <h4 className='text-sm text-center text-black mt-1'>BOOKINGS</h4>
                        </div>
                        <div className='p-2 text-sm'>
                            <h6>accepted: {booking.accepted}</h6>
                            <h6>cancelled: {booking.cancelled}</h6>
                        </div>
                    </div>
                    <div className='border-2 border-gray-100 w-36 h-20 rounded-lg  shadow-xl transition transform duration-300 ease-in-out scale-100 hover:scale-105 hover:shadow-2xl'>
                        <div>

                            <h4 className='text-sm text-center mt-1 text-black'>TRIPS</h4>
                        </div>
                        <div className='p-2 text-sm'>
                            <h6>completed: {trip.accepted}</h6>
                            <h6>cancelled: {trip.cancelled}</h6>
                        </div>
                    </div>
                    <div className='border-2 border-gray-100 w-36 h-20 rounded-lg  shadow-xl transition transform duration-300 ease-in-out scale-100 hover:scale-105 hover:shadow-2xl'>
                        <div>
                            <h4 className='text-sm text-center mt-1 text-black'>VEHICLES</h4>
                        </div>
                        <div className='p-2 text-sm'>
                            <h6>total: {vehicles.active}</h6>
                            <h6>available: {vehicles.inactive}</h6>
                        </div>
                    </div>
                    <div className='border-2 border-gray-100 w-36 h-20 rounded-lg  shadow-xl transition transform duration-300 ease-in-out scale-100 hover:scale-105 hover:shadow-2xl'>
                        <h1 className='text-sm text-center mt-1 text-black'>TOTAL EARNINGS</h1>
                        <h3 className='text-center mt-5'>₹ {total}</h3>
                    </div>
                    <div className='border-2 border-gray-100 w-36 h-20 rounded-lg  shadow-xl transition transform duration-300 ease-in-out scale-100 hover:scale-105 hover:shadow-2xl'>
                        <h1 className='text-sm text-center mt-1 text-black'>TOTAL PROFIT</h1>
                        <h3 className='text-center mt-5'>₹ {total_profit}</h3>

                    </div>
                
                </div>
                <div className=''>

                    <div className='flex shadow-2xl p-5'>
                        <div className='mb-10 text-sm w-4/5 '>
                            <h2 className='text-lg font-semibold mb-4 text-black'>Monthly Data</h2>
                            <div className='mb-4 flex justify-end w-3/4'>
                                <select className='p-2 focus:outline-none rounded-md bg-gray-200 text-black' id="year-select" value={selectedYear} onChange={handleYearChange}>
                                    {years.map(year => (
                                        <option key={year} value={year} className='border-none'>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <ResponsiveContainer width="95%" height={280}>
                                <LineChart data={monthlyFares}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" strokeWidth={3} stroke="#0077B6" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className='w-1/6 flex flex-col items-center gap-3 transition transform duration-300 ease-in-out scale-100 hover:scale-105 ' style={{ height: '395px' }}>
                            <h2 className='text-lg font-semibold mb-4 text-black'>Today's profit</h2>
                            <h5>targeted by 1000</h5>
                            <CircularProgressbar
                                value={(dailyprofit*100)/1000}
                                text={`${'₹'}${dailyprofit}`}
                                styles={buildStyles({
                                    pathColor: '#4db8ff',
                                    textColor: '#4db8ff',
                                    trailColor: '#d6d6d6',
                                })}
                            />
                        </div>
                    </div>

                    <div className='flex py-20 shadow-2xl p-5 mt-10 '>
                        <div className='mb-10 text-sm flex flex-col w-4/5'>
                            <h2 className='text-lg font-semibold mb-4 text-black'>Weekly Data</h2>
                            <ResponsiveContainer width="70%" height={300}>
                                <BarChart data={weeklyData}>
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="completed" fill="#8884d8" radius={20}/>
                                    <Bar dataKey="cancelled" fill="#8884d8" radius={10}/>
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                        {/* <div>
                            <h2 className='text-lg font-semibold mb-4 text-black'>Top Driver's</h2>






                        </div> */}
                    </div>
                </div>

                <div style={{ height: '50vh', width: '90%' }} className='mt-10 shadow-2xl'>
                    <LoadScript
                        googleMapsApiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!}
                    >
                        {mapLoaded && markers.length > 0 && (
                            <GoogleMap
                                center={{ lat: markers[0].lat, lng: markers[0].lng }}
                                zoom={15}
                                mapContainerStyle={{ height: '100%', width: '100%' }}
                                options={{ zoomControl: false, streetViewControl: false }}
                            >
                                {markers.map((marker, index) => (
                                    <Marker
                                        key={index}
                                        position={{ lat: marker.lat, lng: marker.lng }}
                                    />
                                ))}
                            </GoogleMap>
                        )}
                    </LoadScript>
                </div>

            </div>
        </div>
    );
}

export default Page;
