'use client'
import Header2 from '@/component/user/header2/header2'
import React, { useEffect, useState } from 'react'
import { PhoneIcon, ChatIcon } from '@heroicons/react/solid';
import { LoadScript, GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { jwtDecode } from 'jwt-decode';
import httpClient from '@/app/httpClient';
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'
import Payment from '../../../component/razorpay/payment'
import axios from 'axios';

interface DecodedToken {
    sub: string;
}

const Page = () => {
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [traveltime, setTraveltime] = useState('')
    const [fare, setFare] = useState('')
    const [vehicle_type, setVehicle_type] = useState('')
    const [driver_name, setDriver_name] = useState('')
    const [currentLocation, setCurrentlocation] = useState('')
    const [pick_up_location, setPickuplocation] = useState('')
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [isfetch, setIsfetch] = useState(true)
    const navigate = useRouter()
    const [reason, setReason] = useState('')
    const [cancelform, setCancelform] = useState<boolean>(false);
    const [fromride, setfromride] = useState(true)
    const [phone, setPhone] = useState('')
    const [rideid, setRideid] = useState<Number>(0)
    const [payment, setPayment] = useState<String>('')
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!,
        libraries: ['places']
    });

    useEffect(() => {
        const fetchDirections = () => {
            try {
                if (isLoaded){

                const directionsService = new window.google.maps.DirectionsService();

                directionsService.route(
                    {
                        origin: currentLocation,
                        destination: pick_up_location,
                        travelMode: window.google.maps.TravelMode.DRIVING,
                    },
                    (result, status) => {
                        if (status === window.google.maps.DirectionsStatus.OK) {
                            setDirectionsResponse(result);
                        } else {
                            console.error(`error fetching directions ${result}`);
                        }
                    }
                );
            }

            } catch {
            }
        };
        const intervalId = setInterval(fetchDirections, 1000);
        return () => clearInterval(intervalId);
    }, [currentLocation, pick_up_location, isLoaded]);

    useEffect(() => {
        const getrideuser = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const decodedToken = jwtDecode<DecodedToken>(token);
                const email = decodedToken.sub
                const response = await httpClient.post('ride/getrideuser', { 'email': email })
                setTraveltime(response.data['ride']['travel_time'])
                setFare(response.data['ride']['fare'])
                setVehicle_type(response.data['ride']['vehicle_type'])
                setDriver_name(response.data['ride']['driver_name'])
                setCurrentlocation(response.data['ride']['current_location'])
                setPickuplocation(response.data['ride']['pick_up_location'])
                setCenter({ lat: parseFloat(response.data['ride']['live']['lat']), lng: parseFloat(response.data['ride']['live']['lng']) });
                setIsfetch(false)
                setPhone(response.data['ride']['phone'])
                setRideid(response.data['ride']['ride_id'])
                setPayment(response.data['ride']['payment_status'])
            }
        }
        getrideuser();

    }, [isLoaded])

    useEffect(() => {
        if (typeof window !== 'undefined') {
        const driverarrived = async () => {
            const token = localStorage.getItem('accessToken');
            const rideid = localStorage.getItem('rideid')
            if (token) {
                const decodedToken = jwtDecode<DecodedToken>(token);
                const email = decodedToken.sub
                const response = await httpClient.post('ride/istripstarted', { 'email': email, 'rideid': rideid })
                if (response.data['message'] === 'driver is cancelled'){
                    // await axios.post('http://localhost:9641/queue',response.data['communication'],{
                    await axios.post('https://communication.cabquest.quest/queue',response.data['communication'],{
                        headers: {
                          'Content-Type': 'application/json',  // Adjust this if you're sending a different type of data
                        },
                      })
                }
                if (response.data['message'] === 'trip started') {
                    navigate.push('/udestination')
                }
                else if (response.data['message'] === 'driver is cancelled') {
                    navigate.push('/driver_cancelled')
                }
            }
        }
        const intervalId = setInterval(driverarrived, 1000);
        return () => clearInterval(intervalId);
    }
    }, [navigate])

    const handleClick = () => {
        window.location.href = `tel:${phone}`;
    };
    const cancelRequest = async () => {
        if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const rideid = localStorage.getItem('rideid')
        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            const email = decodedToken.sub
            const response = await httpClient.post('ride/cancelfromuser', { 'rideid': rideid, 'reason': reason })
            const response2 = await httpClient.post('booking/cancelfromuser', { 'email': email, 'reason': reason })
            const response3 = await httpClient.post('auth/makeactive2', { 'driverid': response2.data['driverid'] })
            if (response.data['message'] === 'ok' && response2.data['message'] === 'ok' && response3.data['message'] === 'ok') {
                toast.success('Your ride is cancelled')
                setTimeout(() => {
                    navigate.push('/')
                }, 1500);
            }
            else {
                toast.error('something error')
            }
        }
    }
    }

    return (
        <div className='bg-white h-screen'>
            <div className='bg-white'>
                <Header2 />
            </div>
            <div className='w-full flex bg-white flex-col lg:flex-row'>
                <div className='w-full lg:w-1/2 flex justify-center items-center p-5'>

                    <Toaster position='top-right' richColors />

                    {isfetch ? (
                        <div className="border-2 w-full lg:w-1/2 border-gray-300 p-2 rounded-lg">
                            <div className="flex justify-center gap-2 w-full">
                                <div className="m-2">
                                    <div className="h-6 bg-gray-200 animate-pulse rounded-md w-36"></div>
                                </div>
                                <div className="bg-gray-200 p-2 text-sm rounded-md text-transparent w-20 animate-pulse"></div>
                            </div>
                            <div className="flex justify-center">
                                <table className="table-auto w-2/3 text-black">
                                    <tbody>
                                        <tr>
                                            <th className="text-left">
                                                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-20"></div>
                                            </th>
                                            <td className="text-left">
                                                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-24"></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-left">
                                                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-24"></div>
                                            </th>
                                            <td className="text-left">
                                                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-24"></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-left">
                                                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-20"></div>
                                            </th>
                                            <td className="text-left">
                                                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-24"></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-left">
                                                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-20"></div>
                                            </th>
                                            <td className="text-left">
                                                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-24"></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-around">
                                <div className="bg-gray-200 py-2 px-6 rounded-md animate-pulse h-10 w-10"></div>
                                <div className="bg-gray-200 py-2 px-6 rounded-md animate-pulse h-10 w-10"></div>
                                <div className="bg-gray-200 py-2 text-sm px-6 rounded-md animate-pulse h-10 w-24"></div>
                            </div>
                        </div>

                    )
                        :
                        (
                            <div className='border-2 w-full md:w-2/3 lg:w-2/3 border-gray-300 p-6 rounded-lg shadow-lg'>
                                <div className='flex flex-col items-center gap-4 w-full'>
                                    <h1 className='text-black text-lg font-bold text-center'>Will be there within</h1>
                                    <div className='bg-black px-4  text-md rounded-md text-white'>
                                        {traveltime}
                                    </div>
                                </div>
                                <div className='flex justify-center'>
                                    <table className="table-auto w-full md:w-2/3 text-black">
                                        <tbody>
                                            <tr>
                                                <th className='text-left py-2'>Driver</th>
                                                <td className='text-left py-2'>{driver_name}</td>
                                            </tr>
                                            <tr>
                                                <th className='text-left py-2'>Vehicle Type</th>
                                                <td className='text-left py-2'>{vehicle_type}</td>
                                            </tr>
                                            <tr>
                                                <th className='text-left py-2'>Payment</th>
                                                <td className='text-left py-2'>{payment}</td>
                                            </tr>
                                            <tr>
                                                <th className='text-left py-2'>Rate</th>
                                                <td className='text-left py-2'>₹ {fare}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <Payment price={parseInt(fare,10)} fromride={fromride} rideid={rideid}/>
                                <div className='flex flex-col justify-around space-y-2'>
                                    <button className='bg-black hover:bg-gray-800 transition duration-300 py-2 px-6 rounded-md flex justify-center items-center' onClick={handleClick}>
                                        <PhoneIcon className="h-5 w-5 text-gray-200 mr-2" />
                                        <span className="text-white">Call</span>
                                    </button>
                                    <button className='bg-black hover:bg-gray-800 transition duration-300 py-2 px-6 rounded-md flex justify-center items-center ' onClick={() => navigate.push('/chat2')}>
                                        <ChatIcon className="h-5 w-5 text-gray-200 mr-2" />
                                        <span className="text-white">Chat</span>
                                    </button>
                                    <button className='bg-red-600 hover:bg-red-500 transition duration-300 py-2 px-6 text-sm text-white rounded-md' onClick={() => { setCancelform(true) }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>


                        )}
                </div>
                {cancelform && (
                    <div className="fixed flex justify-center items-center z-50 w-full h-1/2 ">
                        <div className='bg-white p-10 rounded-md flex flex-col border-l-2 border-t-2 border-gray-300 shadow-xl'>
                            <button className='text-black self-end' onClick={() => setCancelform(false)}> ✗</button>
                            <div className='text-center w-full'>
                                <h1 className='text-black text-center p-2 text-xl font-bold'>Enter your reason</h1>
                            </div>
                            <div className='text-center w-full py-4'>
                                <input type="text" className='p-2 w-full text-black focus:outline-none bg-gray-300 rounded-md' onChange={(e) => setReason(e.target.value)} />
                            </div>
                            <div className='text-center w-full py-4'>
                                <button className='bg-black py-2 px-10 w-full rounded-md' onClick={cancelRequest}>Submit</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className='w-full lg:w-1/2'>
                    <div className='p-5'>
                        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!} libraries={['places']}>
                            <GoogleMap
                                center={center}
                                zoom={15}
                                mapContainerStyle={{ height: `400px`, width: '100%' }}
                                options={{ zoomControl: false, streetViewControl: false }}
                            >
                                <Marker position={center} />
                                {directionsResponse && (<DirectionsRenderer
                                    directions={directionsResponse}
                                    options={{
                                        polylineOptions: {
                                            strokeColor: '#0077B6',
                                            strokeWeight: 4,

                                        },
                                    }}
                                />
                                )}

                            </GoogleMap></LoadScript>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Page
