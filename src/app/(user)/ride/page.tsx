'use client'
import React, { useEffect, useState } from 'react';
import Header2 from '@/component/user/header2/header2';
import Sidenav from '@/component/user/sidenav/sidenav';
import { GoogleMap, Marker, LoadScript, useJsApiLoader, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import httpClient from '@/app/httpClient';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { XIcon } from '@heroicons/react/solid';
import socketIOClient from 'socket.io-client';
import { useRouter } from 'next/navigation';

interface Location {
  latitude: number;
  longitude: number;
}

interface DecodedToken {
  sub: string;
}

interface DirectionResult {
  request: google.maps.DirectionsRequest;
}

const Page: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [spin, setSpin] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionResponse, setDirectionResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [duration, setDuration] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [price, setPrice] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [spin2, setSpin2] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const router = useRouter();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: ['places']
  });

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            getPlaceName(latitude, longitude);
            setSpin(true);
          },
          (error) => {
            console.error('Error getting user location:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, [isFormVisible, vehicles]);

  useEffect(() => {
    const socket = socketIOClient('http://localhost:9638');

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('price_response', (data: { total?: number; error?: string }) => {
      if (data.total !== undefined) {
        setPrice(data.total);
      } else {
        console.error('Error calculating price:', data.error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChildButtonClick = () => {
    if (map && userLocation) {
      map.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
    }
  };

  const getResult = (result: google.maps.DirectionsResult | null, duration: string, distance: string) => {
    console.log(result, duration, distance)
    setSpin2(true);
    setPrice(null);
    setSelectedVehicle('');
    setDirectionResponse(result);
    setDuration(duration);
    setDistance(distance);

    const get_driver = async () => {
      const response = await httpClient.post('booking/get_driver', result?.request);
      setVehicles(response.data['vehicles']);
      setIsFormVisible(true);
      setSpin2(false);
    };
    get_driver();
  };

  const handleVehicleChange = (vehicle: string) => {
    if (selectedVehicle === vehicle) {
      setSelectedVehicle(''); // Deselect if already selected
    } else {
      setSelectedVehicle(vehicle);
      const getprice = async (vehicle: string) => {
        const response = await httpClient.post('booking/getprice', { 'vehicle': vehicle, 'distance': parseFloat(distance) });
        setPrice(response.data['total']);
      };
      getprice(vehicle);
    }
  };

  const confirmbooking = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setEmail(decodedToken.sub);
    }

    const get_driver = async () => {
      setSpin2(true);
      const data = {
        'email': email,
        'vehicle': selectedVehicle,
        'latitude': userLocation?.latitude,
        'longitude': userLocation?.longitude,
        'price': price,
        'direction': directionResponse,
        'distance': distance
      };

      try {
        const response = await httpClient.post('booking/riderequest', data);
        if (response.data['message'] === 'driver is not available' || response.data['message'] === 'user not found') {
          toast(response.data['message'], { type: 'warning', theme: 'dark', hideProgressBar: true, pauseOnHover: false });
        } else if (response.data['message'] === 'searching for driver') {
          router.push(`/searchingdriver?userid=${response.data['userid']}&driverid=${response.data['driverid']}`);
        }
      } catch (error) {
        console.error("Error during driver request:", error);
        toast("An error occurred. Please try again.", { type: 'error', theme: 'dark', hideProgressBar: true, pauseOnHover: false });
      } finally {
        setSpin2(false);
      }
    };

    get_driver();
  };

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

  if (!isLoaded || !spin) {
    return (
      <div className='bg-white w-full h-screen flex justify-center items-center'>
        <ToastContainer />
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className='bg-white h-full lg:h-screen w-full'>
      <ToastContainer />
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
          {userLocation && (
           
            <GoogleMap
              center={{ lat: userLocation.latitude, lng: userLocation.longitude }}
              zoom={15}
              mapContainerStyle={{ height: `500px`, width: '100%' }}
              options={{ zoomControl: false, streetViewControl: false }}
              onLoad={(map) => setMap(map)}
            >
              <Marker position={{ lat: userLocation.latitude, lng: userLocation.longitude }} />
              {directionResponse && <DirectionsRenderer directions={directionResponse} />}
            </GoogleMap>
          )}
        </div>
      </div>

      {isFormVisible && (
        <div className="absolute w-full h-full top-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg w-80 transition transform duration-300 ease-in-out scale-100 hover:scale-105">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={closeForm}
            >
              <XIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose a Ride</h2>
            {distance && (
              <div className="mb-4 bg-gray-300 rounded-lg p-1">
                <p className="text-white bg-black p-2 rounded-lg">Distance: {distance}</p>
                <p className="text-white bg-black p-2 rounded-lg">Duration: {duration}</p>
              </div>
            )}
            {vehicles ?
              <div className="space-y-4">
                {vehicles.map((vehicle, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition transform duration-200 ease-in-out ${
                      selectedVehicle === vehicle ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-800'
                    } hover:bg-blue-400 hover:text-white`}
                    onClick={() => handleVehicleChange(vehicle)}
                  >
                    <input
                      type="radio"
                      id={`vehicle-${index}`}
                      name="vehicle"
                      value={vehicle}
                      checked={selectedVehicle === vehicle}
                      readOnly
                      className="mr-2 hidden"
                    />
                    <label htmlFor={`vehicle-${index}`} className="cursor-pointer" onClick={() => handleVehicleChange(vehicle)}>
                      {vehicle}
                    </label>
                  </div>
                ))}
              </div> : <h1 className='text-black'>loading...</h1>
            }
            {price ?
              <div className="mt-4 text-gray-600">
                <p>Total Price: ₹{price}</p>
              </div>
              :
              <div className="mt-4 text-gray-600">
                <p>wait for the price...</p>
              </div>}
            <button type="submit" onClick={confirmbooking} className="w-full bg-primary text-white py-2 px-4 rounded mt-6 transition transform duration-300 ease-in-out hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
