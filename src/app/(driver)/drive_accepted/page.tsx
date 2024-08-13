'use client'
import React, { useEffect, useState } from 'react'
import Header from '@/component/driver/driver_header/header'
import { jwtDecode } from 'jwt-decode'
import httpClient from '@/app/httpClient'
import { LoadScript, GoogleMap, Marker, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import { PhoneIcon, ChatIcon } from '@heroicons/react/solid';
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { getDistance } from 'geolib';
import { Toaster, toast } from 'sonner'

interface Coordinates1 {
    lat: number | null;
    lng: number | null;
}

interface Coordinates {
    latitude: number | null;
    longitude: number | null;
}

const Page = () => {
    const [price, setPrice] = useState('')
    const [currentLocation, setCurrentlocation] = useState('')
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [pickupkm, setPickupkm] = useState(0)
    const [demail, setEmail] = useState<string | undefined>('')
    const [totalkm, setTotalkm] = useState(0)
    const [rideid, setRideid] = useState(0)
    const [isLoading, setIsLoading] = useState(true);
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const searchParams = useSearchParams()
    const [phone, setPhone] = useState('')
    const navigate = useRouter()
    const [otp2, setOtp2] = useState('')
    const [otp, setOtp] = useState('')
    const [otpform, setOtpform] = useState(false)
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [reason, setReason] = useState('')
    const [cancelform, setCancelform] = useState<boolean>(false);
    const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!,
        libraries: ['places'],
    });


    const geocodePlaceName = async (placeName: string): Promise<Coordinates | null> => {
        try {
            const response = await axios.get(GEOCODING_API_URL, {
                params: {
                    address: placeName,
                    key: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY,
                },
            });

            const { data } = response;

            if (data.status === 'OK') {
                const { lat, lng } = data.results[0].geometry.location;
                return { latitude: lat, longitude: lng };
            } else {
                console.error('Geocoding API error:', data.status);
                return null;
            }
        } catch (error) {
            console.error('Error fetching geocoding data:', error);
            return null;
        }
    };

    const isWithin3Km = (coord1: Coordinates1, coord2: Coordinates1): boolean => {
        if (coord1.lat === null || coord1.lng === null || coord2.lat === null || coord2.lng === null) {
            return false;
        }

        const distance = getDistance(
            { latitude: coord1.lat, longitude: coord1.lng },
            { latitude: coord2.lat, longitude: coord2.lng }
        );

        return distance <= 3000;
    };

    useEffect(() => {
        try {

            const token = localStorage.getItem('daccessToken');
            if (token) {
                const decodedToken = jwtDecode(token);
                const email = decodedToken.sub;
                setEmail(email)
                const getride = async () => {
                    const response = await httpClient.post('ride/getride', { 'email': email })
                    if (response.data['message'] === 'okkk') {
                        setRideid(response.data['ride']['id'])
                        setPrice(response.data['ride']['fare'])
                        setCurrentlocation(response.data['ride']['current_location'])
                        setPickup(response.data['ride']['pick_up_location'])
                        setDestination(response.data['ride']['drop_location'])
                        setPickupkm(parseFloat(response.data['ride']['pickupkm']))
                        setTotalkm(parseFloat(response.data['ride']['total_km']))
                        setPhone(response.data['ride']['phone'])
                    }

                }
                getride();
                setIsLoading(false)
            }
        } catch {

        }

    }, [])
    useEffect(() => {

        const getloc = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const current_Location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        console.log('asdfasdfasdfaf', current_Location)
                        setCenter(current_Location);
                        const token = localStorage.getItem('daccessToken');
                        if (token) {
                            const decodedToken = jwtDecode(token);
                            const email = decodedToken.sub;
                            const res = await httpClient.post('ride/liveloc', { 'email': email, 'coords': current_Location })
                        }
                    },
                    (error) => {
                        console.error("Error getting the current location: ", error);
                    }
                );

            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        }
        const intervalId = setInterval(getloc, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const transformCoordinates = (coord: Coordinates): { lat: number | null; lng: number | null } => {
        return {
            lat: coord.latitude !== null && coord.latitude !== undefined
                ? parseFloat(coord.latitude.toFixed(4))
                : null,
            lng: coord.longitude !== null && coord.longitude !== undefined
                ? parseFloat(coord.longitude.toFixed(4))
                : null
        };
    };

    const arrived = async () => {
        const current = await geocodePlaceName(pickup);
        console.log('current', current)
        try {
            const token = localStorage.getItem('daccessToken');
            if (!token) {
                toast.error('No access token found');
                return;
            }

            const decodedToken = jwtDecode(token);
            const email = decodedToken.sub;
            const current: Coordinates | null = await geocodePlaceName(pickup);
            const transformed = transformCoordinates(current!);
            console.log('current', current)
            console.log('transformed', transformed)
            if (isWithin3Km(center, transformed)) {
                const response = await httpClient.post('ride/driverarrived', { 'rideid': rideid });
                if (response.data['message'] === 'ok') {
                    setOtp(response.data['otp']);
                } else {
                    toast.error('Failed to receive OTP');
                    return
                }
                setOtpform(true);
            } else {
                toast.warning('You are far from the pickup location');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            toast.error('An error occurred while processing your request');
        }
    }
    const confirmarrive = async () => {
        if (otp.toString() === otp2.toString()) {
            const token = localStorage.getItem('daccessToken');
            if (token) {
                const decodedToken = jwtDecode(token);
                const email = decodedToken.sub;
                const response = await httpClient.post('ride/tripstarted', { 'email': email })
                if (response.data['message'] === 'ok') {
                    navigate.push('/destination')
                }
            }
        }
        else {
            console.log('error')
        }
    }

    useEffect(() => {
        const fetchDirections = () => {
            try {
                const directionsService = new window.google.maps.DirectionsService();
                directionsService.route(
                    {
                        origin: currentLocation,
                        destination: pickup,
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
    }, [currentLocation, pickup]);

    const handleClick = () => {
        window.location.href = `tel:${phone}`;
    };

    const cancelRequest = async () => {
        try {
            const response = await httpClient.post('ride/cancelfromdriver', { 'rideid': rideid, 'reason': reason })
            const response2 = await httpClient.post('booking/cancelledbydriver', { 'email': demail, 'reason': reason })
            const response3 = await httpClient.post('auth/makeactive2', { 'driverid': response2.data['driverid'] })
            if (response.data['message'] === 'ok' && response2.data['message'] === 'ok' && response3.data['message'] === 'ok') {
                toast.success('Your ride is cancelled')
                setTimeout(() => {
                    navigate.push('/driver_hub')
                }, 1500);
            }
            else {
                toast.error('something error')
            }
        }
        catch {
        }
    }

    useEffect(() => {
        const checkusercancelled = async () => {
            try {

                const token = localStorage.getItem('daccessToken');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const email = decodedToken.sub;
                    const response1 = await httpClient.post('ride/getride', { 'email': email })
                    console.log(response1.data)
                    if (response1.data['message'] === 'not found'){
                        navigate.push('/user_cancelled')
                    }
                    const response = await httpClient.post('ride/checkusercancelled', { 'rideid': response1.data['ride']['id'], })
                    if (response.data['message'] === 'cancelled') {
                        navigate.push('/user_cancelled')
                    }
                }
            } catch {

            }
        }
        const intervalId = setInterval(checkusercancelled, 2000);
        return () => clearInterval(intervalId);
    }, [])

    // if (!isLoaded) {
    //     return (
    //       <div className='bg-white w-full h-screen flex justify-center items-center'>
    //         <span className="loading loading-spinner loading-lg"></span>
    //       </div>
    //     );
    //   }

    return (
        <div className='bg-white h-full lg:h-screen'>
            <div className='fixed'>

                <Toaster position='top-right' richColors />
            </div>

            <div className='bg-secondary'>
                <Header />
            </div>
            {cancelform && (
                <div className="fixed flex justify-center items-center z-50 w-full h-1/2 ">
                    <div className='bg-white p-10 rounded-md flex flex-col'>
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
            <div className='w-full flex flex-col lg:flex-row'>
                {otpform && (
                    <div className="fixed flex justify-center items-center z-50 w-full h-1/2 ">
                        <div className='bg-white p-10 rounded-md flex flex-col'>
                            <div className='text-center w-full'>
                                <h1 className='text-black text-center p-2 text-xl font-bold'>Enter otp</h1>
                            </div>
                            <div className='text-center w-full py-4'>
                                <input type="number" className='p-2 w-full text-black focus:outline-none bg-gray-300 rounded-md' onChange={(e) => setOtp2(e.target.value)} />
                            </div>
                            <div className='text-center w-full py-4'>
                                <button className='bg-black py-2 px-10 w-full rounded-md' onClick={confirmarrive}>Submit</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className='w-full justify-center lg:w-1/2 h-full bg-white p-10'>
                    {isLoading ? (
                        <div className='animate-pulse'>
                            <div className='bg-white rounded-md shadow-md p-4 mb-4'>
                                <h1 className='text-transparent bg-gray-200 h-8 mb-2 rounded-md'></h1>
                                <div className='mb-2'>
                                    <h1 className='text-transparent bg-gray-200 h-6'></h1>
                                </div>
                                <div className='mb-2'>
                                    <h1 className='text-transparent bg-gray-200 h-6'></h1>
                                </div>
                                <div className='mb-4'>
                                    <h1 className='text-transparent bg-gray-200 h-6'></h1>
                                </div>
                            </div>
                            <div className='bg-white p-4 rounded-md shadow-md mb-4'>
                                <h1 className='text-transparent bg-gray-200 h-6'></h1>
                            </div>
                            <div className='flex justify-center gap-4 mb-4'>
                                <div className='bg-white p-2 rounded-md shadow-md'>
                                    <button className='text-transparent bg-gray-200 h-8 w-20 rounded-md'></button>
                                </div>
                                <div className='bg-white p-2 rounded-md shadow-md'>
                                    <div className='text-transparent bg-gray-200 h-8 w-8 rounded-full'></div>
                                </div>
                                <div className='bg-white p-2 rounded-md shadow-md'>
                                    <div className='text-transparent bg-gray-200 h-8 w-8 rounded-full'></div>
                                </div>
                            </div>
                            <div className='p-2 bg-black rounded-lg'>
                                <button className='text-transparent bg-gray-800 h-10 w-full rounded-lg'></button>
                            </div>
                        </div>
                    ) : (
                        <div className='bg-gray-300 px-6 py-4 text-center rounded-md shadow-md'>
                            <div className='bg-white rounded-md shadow-md hover:shadow-xl transition duration-300 p-4'>
                                <h1 className='text-black text-center text-lg font-semibold mb-4'>₹ {price}</h1>
                                <div className='mb-2'>
                                    <h1 className='text-gray-800 text-sm'>To Pickup: {pickupkm} km</h1>
                                </div>
                                <div className='mb-2'>
                                    <h1 className='text-gray-800 text-sm'>To Destination: {totalkm} km</h1>
                                </div>
                                <div className='mb-2'>
                                    <h1 className='text-gray-800 text-sm'>Total Distance: {(parseFloat(pickupkm.toString()) + parseFloat(totalkm.toString())).toFixed(2)} km</h1>
                                </div>
                            </div>
                            <div className='py-2'>
                                <div className='bg-white p-4 rounded-md hover:shadow-xl transition duration-300 shadow-md'>
                                    <h1 className='text-gray-800 text-sm'>Pickup Location: {pickup}</h1>
                                </div>
                            </div>

                            <div className='flex justify-center gap-4'>
                                <div className='bg-white text-black text-sm shadow-md hover:shadow-xl transition duration-300 p-2 rounded-md' onClick={() => setCancelform(true)}>
                                    <button>cancel</button>
                                </div>
                                <div className='bg-white p-2 rounded-md shadow-md hover:shadow-xl transition duration-300' onClick={handleClick}>
                                    <PhoneIcon className="z-0 right-2 top-2.5 h-5 w-5 text-gray-800" />
                                </div>
                                <div className='bg-white p-2 rounded-md shadow-md hover:shadow-xl transition duration-300' onClick={() => navigate.push('/chat1')}>
                                    <ChatIcon className="z-0 right-2 top-2.5 h-5 w-5 text-gray-800" />
                                </div>
                            </div>
                            <div className='mt-4'>
                                <div className='p-2 bg-black rounded-lg hover:bg-gray-800 transition duration-300' onClick={arrived}>
                                    <button className='text-white font-semibold px-2 '>Arrived</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                <div className='w-full lg:w-1/2 bg-white shadow-lg'>
                    <div className='p-10'>
                        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!} libraries={['places']}>
                            <GoogleMap
                                center={center}
                                zoom={15}
                                mapContainerStyle={{ height: `350px`, width: '100%' }}
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
