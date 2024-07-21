'use client'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import image from '../../../../public/static/247ea988-a0d6-4757-bed8-b83cf43b3b55.jpeg'
import image2 from '../../../../public/static/WhatsApp_Image_2024-06-06_at_10.26.33_b4404c62-removebg-preview.png'
import dashboard from '../../../../public/static/dashboard.png'
import profile from '../../../../public/static/profile (2).png'
import user from '../../../../public/static/user.png'
import ride from '../../../../public/static/ride-hailing (1).png'
import report from '../../../../public/static/report.png'
import relationship from '../../../../public/static/relationship.png'
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'

const Sidenav = () => {
    const [current, setCurrent] = useState('')
    const navigate = useRouter();
    const [numb, setNumb] = useState<boolean[]>([false, false, false, false, false, false, false]);
    const pat = usePathname();

    useEffect(() => {
        if (localStorage.getItem('isadmin') === 'true') {
            navigate.push(current)
            if (pat === '/dashboard'){
                setNumb([true, false,false,false,false,false,false])
            }else if(pat === '/drivers'){
                setNumb([ false,true,false,false,false,false,false])
            }else if(pat === '/users'){
                setNumb([ false,false,true,false,false,false,false])
            }else if(pat === '/vehicles'){
                setNumb([ false,false,false,true,false,false,false])
            }else if(pat === '/rides'){
                setNumb([ false,false,false,false,true,false,false])
            }else if(pat === '/reports_'){
                setNumb([ false,false,false,false,false,true,false])
            }else if(pat === '/driver_kyc'){
                setNumb([ false,false,false,false,false,false,true])
            }
            
        }
    }, [current])


    const logOut = () => {
        localStorage.removeItem('aaccessToken')
        localStorage.removeItem('arefreshToken')
        localStorage.removeItem('aname')
        localStorage.removeItem('isadmin')
        navigate.push('/admin_login')
    }

    return (
        <div className='flex gap-5'>
            <aside className="md:flex md:flex-col hidden md:w-60 lg:w-72 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-white">
                <div className='flex gap-5 w-full'>
                    <div>
                        <Image className='h-10 w-auto' src={image} alt='' />
                    </div>
                    <div>

                        <Image className="h-10 w-auto" src={image2} alt="example" />
                    </div>
                </div>
                <div className="flex flex-col justify-between flex-1 mt-10">
                    <nav className=" space-y-6">
                        <div className="space-y-1 flex flex-col justify-center items-start">

                            <div className='w-full'>
                                {numb[0] ?
                                    <button className="flex items-center px-3 w-full py-4 text-gray-900 transition-colors duration-300 transform rounded-lg dark:hover:bg-gray-200 hover:text-gray-700 bg-gray-200" onClick={() => setCurrent('/dashboard')} >
                                        <Image src={dashboard} alt='' />
                                        <span className="mx-2 text-sm font-medium">Dashboard</span>
                                    </button> :
                                    <button className="flex items-center px-3 w-full py-4 text-gray-900 transition-colors duration-300 transform rounded-lg  hover:text-gray-700" onClick={() => setCurrent('/dashboard')} >
                                        <Image src={dashboard} alt='' />
                                        <span className="mx-2 text-sm font-medium">Dashboard</span>
                                    </button>
                                }
                            </div>

                            <div className='w-full'>
                                {numb[1] ? <button className="flex items-center px-3 py-4 w-full text-gray-900 transition-colors duration-300 transform rounded-lg dark:hover:bg-gray-200 hover:text-gray-700 bg-gray-200" onClick={() => setCurrent('/drivers')} >
                                    <Image src={profile} alt='' />
                                    <span className="mx-2 text-sm font-medium">Drivers</span>
                                </button> : <button className="flex items-center px-3 py-4 w-full text-gray-900 transition-colors duration-300 transform rounded-lg  hover:text-gray-700" onClick={() => setCurrent('/drivers')} >
                                    <Image src={profile} alt='' />
                                    <span className="mx-2 text-sm font-medium">Drivers</span>
                                </button>}
                            </div>

                            <div className='w-full'>
                                {numb[2] ? <button className="flex items-center px-3 w-full py-4 text-gray-900 transition-colors duration-300 transform rounded-lg dark:hover:bg-gray-200 hover:text-gray-700 bg-gray-200" onClick={() => setCurrent('/users')} >
                                    <Image src={user} alt='' />
                                    <span className="mx-2 text-sm font-medium">Users</span>
                                </button> : <button className="flex items-center px-3 w-full py-4 text-gray-900 transition-colors duration-300 transform rounded-lg  hover:text-gray-700" onClick={() => setCurrent('/users')} >
                                    <Image src={user} alt='' />
                                    <span className="mx-2 text-sm font-medium">Users</span>
                                </button>}
                            </div>

                            <div className='w-full'>
                                {numb[3] ? <button className="flex items-center px-3 py-4 w-full text-gray-900 transition-colors duration-300 transform rounded-lg dark:hover:bg-gray-200 hover:text-gray-700 bg-gray-200" onClick={() => setCurrent('/vehicles')} >
                                    <Image src={relationship} alt='' />
                                    <span className="mx-2 text-sm font-medium">Vehicles</span>
                                </button> : <button className="flex items-center px-3 py-4 w-full text-gray-900 transition-colors duration-300 transform rounded-lg  hover:text-gray-700" onClick={() => setCurrent('/vehicles')} >
                                    <Image src={relationship} alt='' />
                                    <span className="mx-2 text-sm font-medium">Vehicles</span>
                                </button>}
                            </div>

                            <div className='w-full'>
                                {numb[4] ? <button className="flex items-center px-3 py-4 w-full text-gray-900 transition-colors duration-300 transform rounded-lg dark:hover:bg-gray-200 hover:text-gray-700 bg-gray-200" onClick={() => setCurrent('/rides')} >
                                    <Image src={ride} alt='' />
                                    <span className="mx-2 text-sm font-medium">Rides</span>
                                </button> : <button className="flex items-center px-3 py-4 w-full text-gray-900 transition-colors duration-300 transform rounded-lg  hover:text-gray-700" onClick={() => setCurrent('/rides')} >
                                    <Image src={ride} alt='' />
                                    <span className="mx-2 text-sm font-medium">Rides</span>
                                </button>}
                            </div>

                            <div className='w-full'>
                                {numb[5] ? <button className="flex items-center px-3 py-4 w-full text-gray-900 transition-colors duration-300 transform rounded-lg dark:hover:bg-gray-200 hover:text-gray-700 bg-gray-200" onClick={() => setCurrent('/reports_')} >
                                    <Image src={report} alt='' />
                                    <span className="mx-2 text-sm font-medium">Reports</span>
                                </button> : <button className="flex items-center px-3 py-4 w-full text-gray-900 transition-colors duration-300 transform rounded-lg  hover:text-gray-700" onClick={() => setCurrent('/reports_')} >
                                    <Image src={report} alt='' />
                                    <span className="mx-2 text-sm font-medium">Reports</span>
                                </button>}
                            </div>

                            <div className='w-full'>
                                {numb[6] ? <button className="flex items-center px-3 py-4 w-full text-gray-900 transition-colors duration-300 transform rounded-lg dark:hover:bg-gray-200 hover:text-gray-700 bg-gray-200" onClick={() => setCurrent('/driver_kyc')} >
                                    <Image src={relationship} alt='' />
                                    <span className="mx-2 text-sm font-medium">Driver KYC</span>
                                </button> : <button className="flex items-center px-3 py-4 w-full text-gray-900 transition-colors duration-300 transform rounded-lg      hover:text-gray-700" onClick={() => setCurrent('/driver_kyc')} >
                                    <Image src={relationship} alt='' />
                                    <span className="mx-2 text-sm font-medium">Driver KYC</span>
                                </button>}
                            </div>

                        </div>
                    </nav>
                    <div className="flex items-center px-3 -mx-2">

                    </div>
                    <div className='font-pt-sans flex gap-4 ml-9 hover:cursor-pointer mt-3'>
                        <h1 onClick={logOut} className='font-pt-sans text-l  font-semibold text-black'>
                            Logout
                        </h1>
                        <h1 className='text-black font-bold font-pt-sans text-xl'>Q</h1>
                    </div>

                </div>
            </aside>
        </div>
    )
}

export default Sidenav
