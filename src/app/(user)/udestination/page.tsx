'use client'
import Header2 from '@/component/user/header2/header2'
import React, { useEffect, useState } from 'react'
import { LoadScript, GoogleMap, Marker, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import httpClient from '@/app/httpClient';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';    
import Payment from '@/component/razorpay/payment';


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
    const [update, setgetupdate] = useState('')
    const [pickup, setPickup] = useState('')
    const navigate = useRouter()
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!,
        libraries:['places']
    });


    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            const email = decodedToken.sub;

            const getride = async () => {
                const response = await httpClient.post('ride/getride2', { 'email': email })
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
    }, [])

    useEffect(() => {
        const fetchDirections = () => {
            try {
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
            } catch {
            }
        };
        fetchDirections();

    }, [currentLocation, pickup,destination]);

    useEffect(() => {
        const getlive = async () => {
            const token = localStorage.getItem('accessToken');
            const rideid2 = localStorage.getItem('rideid')
            setRideid(parseInt(rideid2!, 10))
            if (token) {
                const decodedToken = jwtDecode(token);
                const email = decodedToken.sub
                const response = await httpClient.post('ride/getlive', { 'email': email })
                const driverLocation = { lat: response.data['latitude'], lng: response.data['longitude'] }
                setCenter({ lat: response.data['latitude'], lng: response.data['longitude'] })
                const ridefinish = await httpClient.post('ride/isridefinish',{'email':email,'rideid':rideid2})
                if (ridefinish.data['message'] === 'trip completed'){
                    localStorage.removeItem('rideid')
                    navigate.push('/')

                }

            }
        }
        const intervalId = setInterval(getlive, 1000);
        return () => clearInterval(intervalId);
    }, [])

    return (
        <div className='bg-white h-screen'>
            <div>
                <Header2 />
            </div>
            <div className='w-full bg-white'>
                <div className='p-10 flex flex-col items-center justify-center'>
                    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places']}>
                        <GoogleMap
                            center={center}
                            zoom={15}
                            mapContainerStyle={{ height: `400px`, width: '70%' }}
                            options={{ zoomControl: false, streetViewControl: false }}
                        >
                            <Marker position={center} />
                            {directionsResponse && (
                                <DirectionsRenderer
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
                    <div className='w-2/3'>
                    {rideid &&
                    <Payment price={parseInt(price, 10)} rideid={rideid} fromride={false}/>}
                </div>
                </div>
            </div>
        </div>
    )
}

export default Page
