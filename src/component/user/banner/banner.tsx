import React from 'react';
import Image from 'next/image';
import car from '../../../../public/static/Dream_TradingCard__2_-removebg2-removebg-preview.png';
import sideimg from '../../../../public/static/WhatsApp Image 2024-06-06 at 11.24.54_c20ff507.jpg';
import location from '../../../../public/static/maps-and-flags.png';
import destination from '../../../../public/static/destinations.png';
import { useRouter } from 'next/navigation';
const Banner: React.FC = () => {
  const navigate = useRouter();
  const onsubmit = (e:any) =>{
    e.preventDefault()
      navigate.push('/ride')
  }
  return (
    <div className='bg-primary h-4/5 p-5 lg:p-20 flex text-black flex-col lg:flex-row justify-around'>
      <form onSubmit={onsubmit}>
        <div className='flex flex-col gap-5 font-fontFamily items-center p-5'>
          <Image src={sideimg} alt='sideimg' className='h-20 lg:h-auto w-80 md:w-96' />
          <div className="relative">
            <input 
              required 
              type="text" 
              className="w-60 p-3 pl-10 bg-white pr-3 rounded-lg focus:outline-none font-semibold md:w-80" 
              placeholder="Enter location" 
            />
            <Image 
              src={location} 
              alt='location' 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
            />
          </div>
          <div className='relative'>
            <input 
              required 
              type="text" 
              className="w-60 p-3 pl-10 pr-3 bg-white text-black rounded-lg focus:outline-none font-semibold md:w-80" 
              placeholder="Enter destination" 
            />
            <Image 
              src={destination} 
              alt='destination' 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
            />
          </div>
          <div className='relative mb-6'>
            <button 
              type='submit' 
              className='bg-white p-2 rounded-lg font-bold'
            >
              Check Details
            </button>
          </div>
        </div>
      </form>
      <div className="mt-5 lg:mt-0 lg:ml-5 flex flex-col items-center p-2">
        <h1 className='text-white font-bold hidden md:block md:text-5xl lg:text-6xl z-1'>
          MAKE YOUR RIDE <br /> SAFE AND EASY
        </h1>
        <Image src={car} alt='car' className='z-0 -mt-20' />
      </div>
    </div>
  );
}

export default Banner;
