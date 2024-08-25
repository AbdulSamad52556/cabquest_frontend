'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Header2 from '@/component/user/header2/header2';
import Sidenav from '@/component/user/sidenav/sidenav';
import { GoogleMap, Marker, LoadScript, useJsApiLoader, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import { Toaster, toast } from 'sonner'
import httpClient from '@/app/httpClient';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { XIcon } from '@heroicons/react/solid';
import socketIOClient from 'socket.io-client';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';

interface Location {
  lat: number;
  lng: number;
}

interface Vehicle {
  id: number;
  type: string;
}

interface DecodedToken {
  sub: string;
}

interface DirectionResult {
  request: google.maps.DirectionsRequest;
}

interface ApiResponse {
  vehicles: Vehicle[];
}

interface Window {
  Razorpay: any;
}


const Page: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [spin, setSpin] = useState<boolean>(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionResponse, setDirectionResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [price, setPrice] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [spin2, setSpin2] = useState<boolean>(false);
  const [alert, setAlert] = useState('')
  const router = useRouter();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: ['places']
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await httpClient.get<ApiResponse>('auth/allvehicles');
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
    setAlert('alerted')
  }, [isLoaded]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log('Latitude:', latitude, 'Longitude:', longitude);
              setUserLocation({ lat: latitude, lng: longitude });
              getPlaceName(latitude, longitude);
              setSpin(true);
            },
            (error) => {
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  toast.error('User denied the request for Geolocation.');
                  break;
                case error.POSITION_UNAVAILABLE:
                  toast.error('Location information is unavailable.');
                  break;
                case error.TIMEOUT:
                  toast.error('The request to get user location timed out.');
                  break;
                default:
                  toast.error('An unknown error occurred.');
                  break;
              }
              setSpin(false);  
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,  
              maximumAge: 0   
            }
          );
        } else {
          toast.error('Geolocation is not supported by this browser.');
        }
      };
  
      if (!localStorage.getItem('accessToken')) {
        router.push('/login');
      } else {
        getLocation();
      }
    }
  }, [isFormVisible, vehicles, alert, isLoaded, router]);

  const handleChildButtonClick = () => {
    if (map && userLocation) {
      map.panTo({ lat: userLocation.lat, lng: userLocation.lng });
    }
  };

  const getResult = (result: google.maps.DirectionsResult | null, duration: string, distance: string) => {
    setSpin2(true);
    setPrice(null);
    setSelectedVehicle('');
    setDirectionResponse(result);
    setDuration(duration);
    setDistance(distance);

    const getDriver = async () => {
      try {
        const response = await httpClient.post('booking/get_driver', result?.request);
        const uniqueTypes = Array.from(new Set(response.data['vehicles'].map((item: Vehicle) => item.type)));
        const uniqueData = vehicles.filter(item =>
          !uniqueTypes.includes(item.type)
        );
        console.log(uniqueTypes)
        console.log(vehicles)
        console.log(uniqueData)
        console.log(response.data['vehicles'])
        const mergedData = [...response.data['vehicles'], ...uniqueData];
        console.log(mergedData)
        setVehicles(mergedData)
        setIsFormVisible(true);
        setSpin2(false);
      } catch (error) {
        toast.error('Error getting driver');
        setSpin2(false)
        console.error('Error getting driver:', error);
      }
    };
    getDriver();
  };

  const handleVehicleChange = (vehicle: string) => {
    if (selectedVehicle === vehicle) {
      setSelectedVehicle('');
    } else {
      setSelectedVehicle(vehicle);
      const getprice = async (vehicle: string) => {
        try {
          const response = await httpClient.post('booking/getprice', { vehicle, distance: parseFloat(distance) });
          setPrice(response.data.total);
        } catch (error) {
          toast.error('Error fetching price');
          setSpin2(false)
          console.error('Error fetching price:', error);
        }
      };
      getprice(vehicle);
    }
  };

  const confirmBooking = async (e: React.FormEvent) => {
    if (typeof window !== 'undefined') {
    setSpin2(true)
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setEmail(decodedToken.sub);
        const email2 = decodedToken.sub
        const data = {
          email: email2,
          vehicle: selectedVehicle,
          latitude: userLocation?.lat,
          longitude: userLocation?.lng,
          price,
          direction: directionResponse,
          distance
        };

        const response = await httpClient.post('booking/riderequest', data);
        if (response.data.message === 'driver is not available' || response.data.message === 'user not found') {
          toast.warning(response.data.message);
        } else if (response.data.message === 'searching for driver') {
          router.push(`/searchingdriver?userid=${response.data.userid}&driverid=${response.data.driverid}`);
        }
      }

    } catch (error) {
      console.error("Error during driver request:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSpin2(false);
    }
  }
  };

  const onUnmount = useCallback((map: any) => {
    setMap(null);
  }, []);

  const getPlaceName = async (lat: number, lng: number) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results;
      if (results.length > 0) {
        setLocation(results[0].formatted_address);
      } else {
        setLocation('No address found');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const closeForm = () => {
    setIsFormVisible(false);
  };

  if ( !spin) {
    return (
      <div className='bg-white w-full h-screen flex justify-center items-center'>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className='bg-white w-full h-screen flex justify-center items-center'>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // if (loadError) {
  //   console.error("Error loading Google Maps:", loadError);
  //   return <div>Error loading Google Maps.</div>;
  // }

  const createOrder = async () => {
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      console.log(res.json())
      const data = await res.json();

      if (data.orderID) {
        return data.orderID;
      } else {
        throw new Error('Order ID not found in response');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error; 
    }
  }

  return (
    <div className='bg-white h-full lg:h-screen w-full'>
      <Toaster position='top-right' richColors />
      {spin2 &&
        <div className='fixed z-10 bg-black bg-opacity-50 w-full h-screen flex justify-center items-center'>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
      <div>
        <Header2 />
      </div>
      <div className='xs:flex xs:flex-col xs:justify-center xs:items-center md:flex md:flex-row xs:w-full'>
        <div className='w-full md:w-1/2 lg:w-1/3'>
          <Sidenav onButtonClick={handleChildButtonClick} Autocomplete={Autocomplete} result={getResult} placename={location} />
        </div>
        
        <div className='xs:w-full sm:w-full md:w-3/5 xs:p-10 sm:p-10 md:p-0 mb-2'>
        {/* <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!} libraries={['places']}> */}
            <GoogleMap
              center={userLocation || { lat: 0, lng: 0 }} 
              zoom={15}
              mapContainerStyle={{ height: '500px', width: '100%' }}
              options={{ zoomControl: false, streetViewControl: false }}
              onLoad={(map) => setMap(map)}
              onUnmount={onUnmount}
            >
              {userLocation && <Marker position={userLocation} />}
              {directionResponse && <DirectionsRenderer directions={directionResponse} />}
            </GoogleMap>
        </div>
      </div>

      {isFormVisible && (
        <div className="absolute w-full h-full top-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg w-96 transition transform duration-300 ease-in-out scale-100 hover:scale-105">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={closeForm}
            >
              <XIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose a Ride</h2>
            {distance && (
              <div className="mb-4 rounded-lg p-1">
                <p className="text-white bg-black p-2 mb-1 rounded-md text-center">Distance: {distance}</p>
                <p className="text-white bg-black p-2 rounded-md text-center">Duration: {duration}</p>
              </div>
            )}
            {vehicles.length > 0 ? (
              <div className="space-y-4 w-full">
                {vehicles.map((vehicle, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-4 w-80 rounded-lg cursor-pointer transition transform duration-200 ease-in-out ${selectedVehicle === vehicle.type
                      ? 'bg-violet-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                      } ${vehicle.id === 0 ? 'hover:text-black hover:bg-gray-300' : 'hover:bg-blue-400 hover:text-white'}`}
                    onClick={() => {
                      if (vehicle.id !== 0) {
                        handleVehicleChange(vehicle.type);
                      }
                    }}
                  >
                    <input
                      type="radio"
                      id={`vehicle-${index}`}
                      name="vehicle"
                      value={vehicle.type}
                      checked={selectedVehicle === vehicle.type}
                      readOnly
                      className="mr-2 hidden"
                    />
                    <label htmlFor={`vehicle-${index}`} className={`${vehicle.id === 0 ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`}>
                      {vehicle.type} {vehicle.id === 0 && '(Driver not available)'}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <h1 className='text-black'>Loading...</h1>
            )}
            {price ?
              <div className="mt-4 text-gray-600">
                <p>Total Price: ₹{price}</p>
              </div>
              :
              <div className="mt-4 text-gray-600">
                <p>select one for getting price</p>
              </div>}
            {price &&
            <>
            
              <button type="submit" onClick={confirmBooking} className="w-full bg-primary text-white py-2 px-4 rounded mt-2 transition transform duration-300 ease-in-out hover:bg-black hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                <div className=' rounded-lg flex justify-center items-center'>
                  Confirm Ride
                </div>
              </button></>
            }

          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
