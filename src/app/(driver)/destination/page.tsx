'use client'
import Header from '@/component/driver/driver_header/header'
import React, { useEffect, useState } from 'react'
import { LoadScript, DistanceMatrixService, GoogleMap, Marker, useJsApiLoader, Polyline, DirectionsService, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import { jwtDecode } from 'jwt-decode'
import httpClient from '@/app/httpClient'
import { useRouter } from 'next/navigation';
const Page = () => {
    const [price, setPrice] = useState('')
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [destination, setDestination] = useState('')
    const [pickupkm, setPickupkm] = useState(0)
    const [totalkm, setTotalkm] = useState(0)
    const [isLoading, setIsLoading] = useState(true);
    const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
    const [currentLocation, setCurrentlocation] = useState('')
    const [rideid, setRideid] = useState(0)
    const navigate = useRouter()
    const [pickup, setPickup] = useState('')
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!,
        libraries: ['places']
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
        const token = localStorage.getItem('daccessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            const email = decodedToken.sub;

            const getride = async () => {
                const response = await httpClient.post('ride/getride', { 'email': email })
                setRideid(response.data['ride']['id'])
                setPrice(response.data['ride']['fare'])
                setCurrentlocation(response.data['ride']['current_location'])
                setPickup(response.data['ride']['pick_up_location'])
                setDestination(response.data['ride']['drop_location'])
                setPickupkm(parseFloat(response.data['ride']['pickupkm']))
                setTotalkm(parseFloat(response.data['ride']['total_km']))
            }
            getride();
            setIsLoading(false)
        }
    }
    }, [])

    useEffect(() => {
        const fetchDirections = () => {
            try {
                if (isLoaded) {

                    const directionsService = new window.google.maps.DirectionsService();
                    directionsService.route(
                        {
                            origin: pickup,
                            destination: destination,
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
                } else {
                    console.error(`error fetching directions ${status}`);
                }

            } catch {

            }

        };

        fetchDirections();
    }, [destination, pickup, isLoaded]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
        const getloc = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const current_Location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
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
    }
    }, []);

    const reached = async () => {
        if (typeof window !== 'undefined') {
        const response3 = await httpClient.post('ride/getpayment', { 'rideid': rideid })
        if (response3.data['message'] === 'ok') {
            navigate.push('/payment_not_done')
            return
        }

        const token = localStorage.getItem('daccessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            const email = decodedToken.sub;
            const response = await httpClient.post('ride/ridefinish', { 'email': email, 'rideid': rideid })
            const response2 = await httpClient.post('booking/ridefinish', { 'email': email, 'rideid': rideid })
            if (response.data['message'] === 'ok') {
                navigate.push('/driver_hub')
            }
        }
    }
    }

    // if (!isLoaded) {
    //     return (
    //         <div className='bg-white w-full h-screen flex justify-center items-center'>
    //             <span className="loading loading-spinner loading-lg"></span>
    //         </div>
    //     );
    // }
    return (
        <div className='bg-white h-screen'>
            <div className='bg-secondary'>
                <Header></Header>
            </div>
            <div className='w-full bg-white '>
                <div className='p-10 flex justify-center'>
                    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!} libraries={['places']}>
                        <GoogleMap
                            center={center}
                            zoom={15}
                            mapContainerStyle={{ height: `400px`, width: '70%' }}
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

                        </GoogleMap>
                    </LoadScript>
                </div>
                <div className='w-full flex justify-center'>
                    <div className='w-1/3 text-center'>
                        <div className='p-2 bg-black rounded-lg hover:bg-gray-800 transition duration-300' onClick={reached}>
                            <button className='text-white font-semibold px-2 '>Reached</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
