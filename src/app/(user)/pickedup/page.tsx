'use client'
import Header2 from '@/component/user/header2/header2'
import React, { useEffect, useReducer, useState } from 'react'
import { PhoneIcon, ChartBarIcon, ChatIcon, ArrowCircleDownIcon } from '@heroicons/react/solid';
import { LoadScript, DistanceMatrixService, GoogleMap, Marker, useJsApiLoader, Polyline, DirectionsService, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import { jwtDecode } from 'jwt-decode';
import httpClient from '@/app/httpClient';
import { useRouter } from 'next/navigation'

interface DecodedToken {
    sub: string;
}


const page = () => {
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
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!,
        // libraries: ['places']
    });

    useEffect(() => {
        const fetchDirections = () => {
            try {
                const directionsService = new window.google.maps.DirectionsService();
                console.log(currentLocation)
                console.log(pick_up_location)
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

            } catch {

            }

        };
        fetchDirections();
    }, [currentLocation, pick_up_location]);

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
            }
        }
        getrideuser();

    }, [])

    useEffect(()=>{
        const driverarrived = async() =>{
            const token = localStorage.getItem('accessToken');
            if (token) {
                const decodedToken = jwtDecode<DecodedToken>(token);
                const email = decodedToken.sub
                const response = await httpClient.post('ride/istripstarted',{'email':email})
                if (response.data['message'] === 'trip started'){
                    navigate.push('/udestination')
                }
        }
    }
    const intervalId = setInterval(driverarrived, 1000);
        return () => clearInterval(intervalId);
    },[])


    return (
        <div className='bg-white h-screen'>
            <div className='bg-white'>
                <Header2 />
            </div>
            <div className='w-full flex bg-white flex-col lg:flex-row'>
                <div className='w-full lg:w-1/2 flex justify-center items-center p-5'>

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
                                                <td className='text-left py-2'>Pending</td>
                                            </tr>
                                            <tr>
                                                <th className='text-left py-2'>Rate</th>
                                                <td className='text-left py-2'>₹ {fare}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className='flex flex-col justify-around space-y-2'>
                                    <button className='bg-black hover:bg-gray-800 transition duration-300 py-2 px-6 rounded-md flex justify-center items-center'>
                                        <PhoneIcon className="h-5 w-5 text-gray-200 mr-2" />
                                        <span className="text-white">Call</span>
                                    </button>
                                    <button className='bg-black hover:bg-gray-800 transition duration-300 py-2 px-6 rounded-md flex justify-center items-center ' onClick={()=>navigate.push('/chat2')}>
                                        <ChatIcon className="h-5 w-5 text-gray-200 mr-2" />
                                        <span className="text-white">Chat</span>
                                    </button>
                                    <button className='bg-red-600 hover:bg-red-500 transition duration-300 py-2 px-6 text-sm text-white rounded-md'>
                                        Cancel
                                    </button>
                                </div>
                            </div>


                        )}
                </div>

                <div className='w-full lg:w-1/2'>
                    <div className='p-5'>
                        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}>
                            <GoogleMap
                                center={center}
                                zoom={15}
                                mapContainerStyle={{ height: `400px`, width: '100%' }}
                                options={{ zoomControl: false, streetViewControl: false }}
                            >
                                <Marker position={center} />
                                console.log(directionsResponse)
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

export default page
