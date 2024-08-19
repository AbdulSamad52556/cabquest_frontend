'use client'
import Header from '@/component/driver/driver_header/header'
import React, { useEffect, useState } from 'react'
import Home from '@/component/driver/driver_home/home'
import { Toaster, toast } from 'sonner'
import io, { Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode'
import httpClient from '@/app/httpClient'
import { useRouter } from 'next/navigation'

interface DecodedToken {
  sub: string;
}

interface NotificationData {
  message: string;
  price: number;
  distance: number;
  direction: {
    request: {
      destination: {
        query: string;
      };
      origin: {
        query: string;
      };
    };
  };
  user_id: number;
  driver_id: number;
  vehicle: string;
}

interface CurrentLocation {
  lat: number;
  lon: number;
}

const Page: React.FC = () => {
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [destination, setDestination] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [driveremail, setDriveremail] = useState<string>('');
  const [cancelform, setCancelform] = useState<boolean>(false);
  const [userid, setUserid] = useState<number>(0);
  const [driverid, setDriverid] = useState<number>(0);
  const [vehicle, setVehicle] = useState<string>('');
  const [currentlocation, setCurrentlocation] = useState<CurrentLocation>({ lat: 0, lon: 0 });
  const [spin, setSpin] = useState<boolean>(false)
  const [bookingid, setBookingid] = useState<number>(0)
  const [reason, setReason] = useState<string>('')

  const router = useRouter();

  const playAudio = (): void => {
    const audioUrl = '/static/notification/mixkit-happy-bells-notification-937.mp3';
    const audio = new Audio(audioUrl);
    audio.play().catch(error => console.error('Error playing audio:', error));
  };

  useEffect(() => {
    const initializeSocket = (email: string): (() => void) => {
      try {
        const socket: Socket = io('https://api.cabquest.quest/booking/', {
          query: { email }
        });

        socket.on('connect', () => {
          console.log('Connected to socket server');
        });

        socket.on('notification', (data: NotificationData) => {
          setMessage(data.message);
          setPrice(data.price);
          setDistance(data.distance);
          setDestination(data.direction.request.destination.query);
          setOrigin(data.direction.request.origin.query);
          setUserid(data.user_id);
          setDriverid(data.driver_id);
          setVehicle(data.vehicle);
          playAudio();
          setShowNotification(true);
        });

        return () => {
          socket.disconnect();
        };
      } catch (error) {
        console.error('Error initializing socket:', error);
        return () => { };
      }
    };

    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('daccessToken');
        if (token) {
          const decodedToken = jwtDecode<DecodedToken>(token);
          const email = decodedToken.sub;
          setDriveremail(email);
          const cleanupSocket = initializeSocket(email);
          return cleanupSocket;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [driveremail]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const loading = localStorage.getItem('dloading');
        if (loading) {
          toast.success(loading)
          localStorage.removeItem('dloading');
          // window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const cancelRequest = async () => {
    if (bookingid === 0 || reason === '') {
      toast.warning('reason is not valid')
      return
    }

    try {
      const response = await httpClient.post('booking/cancelrequest', { id: bookingid, email: driveremail, user_id: userid, reason: reason });
      if (response.data['message'] === 'cancelled successful') {
        setCancelform(false)
        toast.warning(response.data['message']);
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel the request');
    }
  }

  const cancelreason = async () => {
    setShowNotification(false);
    setCancelform(true);
    const response = await httpClient.post('booking/getpending', { 'email': driveremail })
    console.log(response.data['id'])
    setBookingid(response.data['id'])
  };

  const getlocation = (lat: number, lon: number): void => {
    setCurrentlocation({ lat, lon });
  };

  const statuson = async (e: React.FormEvent): Promise<void> => {
    setSpin(true)
    e.preventDefault();
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('daccessToken');
        if (token) {
          const decodedToken = jwtDecode<DecodedToken>(token);
          const email = decodedToken.sub;
          await httpClient.post('auth/driveaccept', { 'email': email });
          await httpClient.post('booking/acceptbydriver', { user_id: userid, driver_id: driverid });

          const ridedata = {
            user_id: userid,
            driver_id: driverid,
            vehicle_type: vehicle,
            current_location: currentlocation,
            pick_up_location: origin,
            drop_location: destination,
            total_km: distance,
            fare: price,
          };
          await httpClient.post('ride/createride', ridedata);
          setShowNotification(false);
          router.push('/drive_accepted');
        }}
      } catch (error) {
        console.error('Error accepting ride:', error);
      }
      finally {
        setSpin(false)
      }
    };

    return (
      <div className='bg-secondary h-screen'>

        <Toaster position='top-right' richColors />
        <div className='bg-secondary'>
          <Header />
          {cancelform && (
            <div className="fixed flex justify-center items-center z-50 w-full h-1/2 ">
              <div className='bg-white p-10 rounded-md flex flex-col'>
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
          {spin &&
            <div className='fixed z-10 bg-black bg-opacity-0 w-full h-3/4 flex justify-center items-center'>
              <span className="loading loading-spinner loading-lg"></span>
            </div>}
          {showNotification && (
            <div className="fixed flex justify-center items-center z-50 w-full">
              <div className="bg-secondary border-2 border-violet-800 shadow-lg rounded-lg p-4 w-fit">
                <table className="table-auto w-full">
                  <tbody>
                    <tr>
                      <th className="text-left text-lg font-semibold mb-2">From:</th>
                      <td className="text-lg mb-2">{origin}</td>
                    </tr>
                    <tr>
                      <th className="text-left text-lg font-semibold mb-2">To:</th>
                      <td className="text-lg mb-2">{destination}</td>
                    </tr>
                    <tr>
                      <th className="text-left text-lg font-semibold mb-2">Distance:</th>
                      <td className="text-lg mb-2">{distance} km</td>
                    </tr>
                    <tr>
                      <th className="text-left text-lg font-semibold mb-2">Price:</th>
                      <td className="text-lg mb-2">₹{price}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={statuson}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Accept
                  </button>
                  <button
                    onClick={cancelreason}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <Home getlocation={getlocation} />
        </div>
      </div>
    );
  };

  export default Page;
