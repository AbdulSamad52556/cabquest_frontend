'use client'
import React, { useEffect, useState } from 'react'
import { Chart, ArcElement } from 'chart.js'
Chart.register(ArcElement);

import image from '../../../../public/static/out-0.webp'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import httpClient from '@/app/httpClient';
import {jwtDecode} from 'jwt-decode';
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation';

type LocationState = {
  latitude: number | null;
  longitude: number | null;
};

type HomeProps = {
  getlocation: (latitude: number, longitude: number) => void;
};

type DecodedToken = {
  sub: string;
};

const Home: React.FC<HomeProps> = ({ getlocation }) => {
  
  const [location, setLocation] = useState<LocationState>({ latitude: null, longitude: null });
  const [error, setError] = useState<string | null>(null);
  const [isActive, setActive] = useState<boolean>(false)
  const [spin, setSpin] = useState(false)
  const navigate = useRouter();
  const [total, setTotal] = useState(0)
  const [today, setToday] =  useState(0)

  useEffect(() => {
    const weeklyearnings = async () => {
        const token = localStorage.getItem('daccessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            const email = decodedToken.sub;
            const response = await httpClient.post('ride/weeklyearnings', { 'email': email })
            setTotal(response.data['message'])
            setToday(response.data['today'])
        }
    }
    weeklyearnings();
}, [])

  useEffect(() => {
    if (localStorage.getItem('isactive')) {
      setActive(true)
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          getlocation(position.coords.latitude, position.coords.longitude)
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

  const startWork = async () => {
    setSpin(true)
    const token = localStorage.getItem('daccessToken');
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const email = decodedToken.sub;

      const response = await httpClient.post('auth/makeactive', { email, location })
      console.log(response.data['message'])
      if (response.data['message'] === 'ok') {
        setActive(true)
        localStorage.setItem('isactive', 'true')
        toast.success('work started')
        const response2 = await httpClient.post('ride/liveloc', {  email: email,  coords: { lat: location.latitude, lng: location.longitude}})
        console.log(response2.data['message'])
      }
    }
    setSpin(false)
  }

  const stopWork = async () => {
    setSpin(true)
    const token = localStorage.getItem('daccessToken');
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const email = decodedToken.sub;

      const response1 = await httpClient.post('booking/checknotificationpending', { email })
      if (response1.data['message'] === 'pending') {
        toast.warning('A request is pending')
      } else if (response1.data['message'] === 'ok') {

        const loc = { latitude: null, longitude: null }
        const response = await httpClient.post('auth/makeinactive', { email, loc })
        const response2 = await httpClient.post('ride/liveloc', { 'email':email, 'coords':{'lat':null, 'lng':null} })
        if (response.data['message'] === 'ok' && response2.data['message'] === 'ok') {
          setActive(false)
          localStorage.removeItem('isactive')
          toast.success('duty stopped')
        }
      }
    }
    setSpin(false)
  }

  return (
    <>
      <div className='flex flex-col bg-secondary gap-5 lg:gap-2 p-10 lg:flex-row w-full h-full justify-center'>
      {spin && 
      <div className='fixed z-10 bg-black bg-opacity-0 w-full h-3/4 flex justify-center items-center'>
          <span className="loading loading-spinner loading-lg"></span>
        </div>}
        <div className='fixed'>

        <Toaster position="top-right" />
        </div>
        <div className='lg:w-1/2 w-full flex flex-col justify-center  items-center'>
          <div className='w-full border-2 border-violet-800 p-5 md:p-12 border-opacity-30 hover:border-opacity-60 rounded-lg'>
            <h1 className='lg:text-2xl text-md text-white w-full font-bold'>
              Every Ride is a new Journey - <br />
              may your day be filled with <br />
              safe travels and happy passengers!
            </h1>

            <div className='flex justify-end gap-2 p-5 w-full'>
              <button className='border-4 text-xs w-60 border-violet-800 border-opacity-30 hover:border-opacity-60 text-gray-300 md:px-10 md:py-2 px-8 py-1 rounded-md' onClick={()=>{navigate.push('/earnings')}}>My Earnings</button>
              {isActive ?
                <button className='relative flex items-center border-4 text-xs border-none bg-violet-800 bg-opacity-60 hover:bg-opacity-30 text-gray-300 md:px-10 md:py-2 px-8 py-1 rounded-md' onClick={stopWork}>
                  Stop Duty
                  <span className='inline-block w-2 h-2 bg-green-400 rounded-full ml-2'></span>
                </button>
                :
                <button className='border-4 text-xs border-violet-800 border-opacity-30 hover:border-opacity-60 text-gray-300 md:px-10 md:py-2 px-8 py-1 rounded-md' onClick={startWork}>Start Duty</button>}
            </div>
          </div>
        </div>

        <div className='w-full lg:w-1/2 h-full flex justify-center items-center'>
          <div className='flex flex-col justify-center items-center lg:bg-violet-900 lg:bg-opacity-20 p-5 gap-2 hover:bg-opacity-30 rounded-lg lg:flex-row md:px-20'>
            <div>
              <h1>Today's Earnings</h1>
            </div>
            <div className='p-5 w-60'>
              <CircularProgressbar
                value={(today*100)/2000}
                text={`₹ ${today}`}
                styles={buildStyles({
                  textColor: '#fff',
                  pathColor: '#1A1B71',
                  trailColor: '#d6d6d6',
                  textSize: '7px',
                  strokeLinecap: 'round',
                })}
              />
            </div>

          </div>

        </div>
      </div>
      <div className='flex w-full h-full'>
        <div className='w-1/2'>
        </div>
      </div>
    </>
  )
}

export default Home
