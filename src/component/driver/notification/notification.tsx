'use client'
import httpClient from '@/app/httpClient'
import { jwtDecode } from 'jwt-decode'
import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { ViewGridIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/navigation'
import { isCancel } from 'axios'

interface DecodedToken {
  sub: string;
}

interface Notification {
  [x: string]: string | number
  id: string | number;
  from: string;
  to: string;
  km: string;
  fare: string;
  status: string;
}
type LocationState = {
  latitude: number | null;
  longitude: number | null;
};

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [location, setLocation] = useState<LocationState>({ latitude: null, longitude: null });
  const [spin, setSpin] = useState<boolean>(true)
  const [alert, setAlert] = useState<string>('')
  const [driverEmail, setDriverEmail] = useState<string>('')
  const [cancelForm, setCancelForm] = useState<boolean>(false)
  const [bookingid, setBookingid] = useState<number | string>(0)
  const [userId, setUserId] = useState<number | string>(0)
  const [reason, setReason] = useState('')
  const navigate = useRouter();
  const [driverid, setDriverid] = useState<number>(0)
  const [vehicle, setVehicle] = useState<string>('')
  const [destination, setDestination] = useState<string>('')
  const [distance, setDistance] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [pickup, setPickup] = useState<string>('')
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setSpin(true)
    const getNotifications = async () => {
      const token = localStorage.getItem('daccessToken');
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const email = decodedToken.sub;
        try {
          const response = await httpClient.post('booking/getnotifications', { email: email })
          setDriverEmail(email)
          setNotifications(response.data['message'])
          setSpin(false)
        } catch (error) {
          toast((error as Error).message, { type: 'warning', theme: 'dark', hideProgressBar: true, pauseOnHover: false })
        }
      }
    }
    getNotifications()
  }, [alert])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, [])

  useEffect(() => {
    const getpending = async () => {
      try {
        const token = localStorage.getItem('daccessToken');
        if (token) {
          const decodedToken = jwtDecode<DecodedToken>(token);
          const email = decodedToken.sub;
          try {
            const response = await httpClient.post('booking/getpending2', { 'email': email })
            if (response.status == 200) {
              setUserId(response.data['message']['user_id'])
              setDriverid(response.data['message']['driver_id'])
              setDestination(response.data['message']['destination'])
              setDistance(response.data['message']['total_km'])
              setVehicle(response.data['message']['vehicle_type'])
              setPrice(response.data['message']['fare'])
              setPickup(response.data['message']['from_location'])
            }
          }
          catch {
          }
        }
      }
      catch {
      }
    }
    getpending();
  }, [])

  const cancelRequest = async () => {
    if (bookingid === 0 || reason === '') {
      toast('reason is not valid', { type: 'warning', theme: 'dark', hideProgressBar: true, pauseOnHover: false })
      return
    }

    try {
      const response = await httpClient.post('booking/cancelrequest', { id: bookingid, email: driverEmail, user_id: userId, reason: reason });
      if (response.data['message'] === 'cancelled successful') {
        setCancelForm(false)
        toast(response.data['message'], { type: 'warning', theme: 'dark', hideProgressBar: true, pauseOnHover: false });
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast('Failed to cancel the request', { type: 'error', theme: 'dark', hideProgressBar: true, pauseOnHover: false });
    }
    setAlert('alerted')
  }

  const cancelreason = async (id: string | number, userid: string | number) => {
    setCancelForm(true)
    setBookingid(id)
    setUserId(userid)
  };

  const statusOn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('daccessToken');
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const email = decodedToken.sub;
        await httpClient.post('auth/driveaccept', { email });
        await httpClient.post('booking/acceptbydriver', { user_id: userId, driver_id: driverid });

        const ridedata = {
          user_id: userId,
          driver_id: driverid,
          vehicle_type: vehicle,
          current_location: location,
          pick_up_location: pickup,
          drop_location: destination,
          total_km: distance,
          fare: price,
        };
        console.log(ridedata)
        await httpClient.post('ride/createride', ridedata);
        navigate.push(`/drive_accepted?userid=${userId}&driverid=${driverid}`);
      }
    } catch (error) {
      console.error('Error accepting ride:', error);
    }

  }

  return (
    <div className='bg-secondary p-2'>
      {cancelForm &&
        <div className="fixed flex justify-center items-center z-50 w-full h-1/2 ">
          <div className='bg-white p-10 rounded-md flex flex-col'>
            <div className='text-center w-full'>
              <h1 className='text-black text-center p-2 text-xl font-bold'>Enter your reason</h1>
            </div>
            <div className='text-center w-full py-4'>
              <input type="text" className='p-2 w-full text-black focus:outline-none bg-gray-300 rounded-md' onChange={(e) => { setReason(e.target.value) }} />
            </div>
            <div className='text-center w-full py-4'>
              <button className='bg-black py-2 px-10 w-full rounded-md' onClick={cancelRequest}>submit</button>
            </div>
          </div>
        </div>
      }
      <ToastContainer />
      {spin &&
        <div className='fixed z-10 bg-black bg-opacity-0 w-full h-3/4 flex justify-center items-center'>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
      <h1>Notification</h1>
      <div className="flex flex-col items-center p-2 space-y-4">
        {notifications.length >= 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className={`flex items-center justify-between w-full sm:w-3/4 md:w-3/4 p-4 rounded-lg shadow ${notification.status === 'pending' ? 'bg-gray-800' : 'border-2 border-gray-800'
              }`}>
              <div className="flex items-center space-x-2">
                {(notification.status === 'pending' || notification.status === 'accepted by driver') ?
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span> :
                  <span className="inline-block w-2 h-2 bg-gray-500 rounded-full"></span>
                }
                <span className="text-white text-xs sm:text-sm ">Ride request</span>
              </div>
              <div >
                <table className="table-auto w-full">
                  <tbody>
                    <tr>
                      <th className="text-left text-sm font-semibold">From </th>
                      <td className="text-sm mb-2"> : </td>
                      <td className="text-sm mb-2 text-center">{notification.from}</td>
                    </tr>
                    <tr>
                      <th className="text-left text-sm font-semibold mb-2">To </th>
                      <td className="text-sm mb-2"> : </td>
                      <td className="text-sm mb-2 text-center">{notification.to}</td>
                    </tr>
                    <tr>
                      <th className="text-left text-sm font-semibold mb-2">Distance </th>
                      <td className="text-sm mb-2"> : </td>
                      <td className="text-sm mb-2 text-center">{notification.km} km</td>
                    </tr>
                    <tr>
                      <th className="text-left text-sm font-semibold mb-2">Price </th>
                      <td className="text-sm mb-2"> : </td>
                      <td className="text-sm mb-2 text-center"> ₹{notification.fare} </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center space-x-2">
                {notification.status === 'pending' ? (
                  <>

                    <button onClick={statusOn}
                      className="px-2 py-1 md:px-4 md:py-2 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      ✓
                    </button>
                    <button onClick={() => { cancelreason(notification.id, notification.user_id) }}
                      className="px-2 py-1 md:px-4 md:py-2 text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      ✗
                    </button>
                  </>) : (
                  <>
                    <p className="text-sm mb-2 text-center" > {notification.status}</p>
                  </>)
                }
              </div>
              {notification.status === 'accepted by driver' ?
                <div onClick={() => navigate.push(`/drive_accepted`)} className='cursor-pointer'><ViewGridIcon className="right-2 top-2.5 h-7 w-7 text-gray-400 peer-focus:text-blue-500" /></div> : null
              }
            </div>
          )
          )) : null
        }
      </div>
    </div>
  )
}

export default Notification
