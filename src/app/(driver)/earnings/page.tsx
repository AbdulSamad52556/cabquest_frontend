import Header from '@/component/driver/driver_header/header'
import React from 'react'
import { ArrowCircleLeftIcon } from '@heroicons/react/solid';

const Page = () => {
    return (
        <div className='bg-secondary h-screen'>
            <div>
                <Header></Header>
            </div>
            <div>
                <div className='flex gap-2 '>
                    <ArrowCircleLeftIcon className="left-5 h-7 w-10 top-2 text-white hover:cursor-pointer" />
                    <h1 className='text-white font-bold text-xl'>Weekly Earnings Details</h1>
                </div>
                <div className='flex gap-2 md:gap-5 lg:gap-10 justify-center p-2 my-10'>
                    <div className='w-60 bg-secondary h-24 md:h-32 flex justify-center rounded-lg border-2 border-blue-400'>
                        <h1 className='text-white text-sm text-center md:font-semibold mt-2 md:mt-4'>Total Earnings</h1>
                    </div>
                    <div className='w-60 bg-secondary h-24 md:h-32 flex justify-center rounded-lg border-2 border-blue-400'>
                        <h1 className='text-white text-sm text-center md:font-semibold mt-2 md:mt-4'>Today's Earnings</h1>
                    </div>
                    <div className='w-60 bg-secondary h-24 md:h-32 flex justify-center rounded-lg border-2 border-blue-400'>
                        <h1 className='text-white text-sm text-center md:font-semibold mt-2 md:mt-4'>Daily Incentive</h1>
                    </div>
                    <div className='w-60 bg-secondary h-24 md:h-32 flex justify-center rounded-lg border-2 border-blue-400'>
                        <h1 className='text-white text-sm text-center md:font-semibold mt-2 md:mt-4'>Total Incentive</h1>
                    </div>
                </div>
                <div className='flex flex-col gap-2 p-2 items-center'>
                    <div className='w-full md:w-1/2 lg:w-1/3 bg-secondary h-20 flex justify-center rounded-lg border-2 border-blue-400'>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default Page
