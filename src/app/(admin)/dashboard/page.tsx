'use client'
import Sidenav from '@/component/admin/side_nav/sidenav'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Chart as ChartJS, Title, BarElement, LineElement, CategoryScale, LinearScale } from 'chart.js';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import httpClient from '@/app/httpClient'

ChartJS.register( BarElement, LineElement, CategoryScale, LinearScale);

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
    value: number;
}

const Page: React.FC = () => {
    const navigate = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [markers, setMarkers] = useState<Markers[]>([]);
    const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
    const [monthlyFares, setMonthlyFares] = useState<MonthlyFare[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [years, setYears] = useState<number[]>([]);

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
        const a_tokens = localStorage.getItem('aaccessToken');
        const aloading = localStorage.getItem('aloading');
        if (!a_tokens) {
            navigate.push('/admin_login');
        } else {
            setLoading(true);
        }
        if (aloading) {
            toast(aloading, { type: 'success', theme: 'dark', hideProgressBar: true, pauseOnHover: false, });
            const timer = setTimeout(() => {
                localStorage.removeItem('aloading');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [navigate]);

    useEffect(()=>{
        const fetchweekly = async() =>{
            const resposne = await httpClient.get('booking/weekly-fares')
            setWeeklyData(resposne.data['message'])
            console.log(resposne.data)
        }
        fetchweekly();

    },[])

    useEffect(() => {
        setMapLoaded(true);
    }, []);

    const weeklyData2 = [
        { week: 'SUN', value: 400 },
        { week: 'MON', value: 300 },
        { week: 'TUE', value: 500 },
        { week: 'WED', value: 700 },
        { week: 'THU', value: 600 },
        { week: 'FRI', value: 800 },
        { week: 'SAT', value: 900 },
      ];    

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

    

    const data2 = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Sales',
            data: [12, 19, 3, 5, 2, 3, 7],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };
    
      // Options for the chart
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context:any) => {
                return `${context.dataset.label}: ${context.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      };

    const fetchData = async (year: number) => {
        try {
            const response = await httpClient.get(`ride/monthly_fares/${year}`);
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
                <ToastContainer />
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className='flex bg-white'>
            <ToastContainer />
            <div>
                <Sidenav />
            </div>
            <div className='flex-1 p-10'>
                <div className='flex space-x-5 mb-10'>
                    <div className='border-2 border-gray-200 w-36 h-20 rounded-lg'>
                        <div>
                            <h4 className='text-sm text-center text-black mt-1'>BOOKINGS</h4>
                        </div>
                        <div className='p-2 text-sm'>
                            <h6>accepted</h6>
                            <h6>cancelled</h6>
                        </div>
                    </div>
                    <div className='border-2 border-gray-200 w-36 h-20 rounded-lg'>
                        <div>

                            <h4 className='text-sm text-center mt-1 text-black'>TRIPS</h4>
                        </div>
                        <div className='p-2 text-sm'>
                            <h6>completed</h6>
                            <h6>cancelled</h6>
                        </div>
                    </div>
                    <div className='border-2 border-gray-200 w-36 h-20 rounded-lg'>
                        <div>
                            <h4 className='text-sm text-center mt-1 text-black'>CARS</h4>
                        </div>
                        <div className='p-2 text-sm'>
                            <h6>total</h6>
                            <h6>available</h6>
                        </div>
                    </div>
                    <div className='border-2 border-gray-200 w-36 h-20 rounded-lg'>
                        <h1 className='text-sm text-center mt-1 text-black'>TOTAL EARNINGS</h1>
                    </div>
                    <div className='border-2 border-gray-200 w-36 h-20 rounded-lg'>
                        <h1 className='text-sm text-center mt-1 text-black'>TOTAL PROFIT</h1>
                    </div>
                    <div className='border-2 border-gray-200 w-36 h-20 rounded-lg'>
                        <h1 className='text-sm text-center mt-1 text-black'>SALARY PENDING</h1>
                    </div>
                </div>
                <div className=''>

                <div className='mb-10 text-sm'>
                    <div className='mb-4 flex justify-end w-3/4'>
                        <select className='p-2 focus:outline-none rounded-md bg-gray-200 text-black' id="year-select" value={selectedYear} onChange={handleYearChange}>
                            {years.map(year => (
                                <option key={year} value={year} className='border-none'>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <ResponsiveContainer width="85%" height={300}>
                        <LineChart data={monthlyFares}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" strokeWidth={3} stroke="#0077B6" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className='mb-10 text-sm flex'>
                    {/* <h2 className='text-lg font-semibold mb-4'>Weekly Data</h2> */}
                    <ResponsiveContainer width="60%" height={250}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>

                </div>
                </div>

                <div style={{ height: '50vh', width: '90%' }}>
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
