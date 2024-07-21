import { LockClosedIcon, UserIcon,  OfficeBuildingIcon, IdentificationIcon} from '@heroicons/react/solid'
import React from 'react'

const Bank_form = () => {
    return (
        <div>
            <div className='p-5'>
                <h1 className="text-2xl md:text-3xl lg:text-4xl text-center font-bold">Enter your Bank Details</h1>
            </div>
            <form action="">
            <div className='w-full gap-10 flex p-10 flex-col justify-center items-center h-full'>

                <div className="relative">
                    <input
                        id='accountno'
                        type="password"
                        name="accountno"
                        className='peer w-80 md:w-96 text-gray-900 border-b-2 z-1 outline-none bg-transparent p-2'
                        placeholder='Account Number'
                        required
                    />
                    <LockClosedIcon className="absolute z-0 right-2 top-2.5 h-5 w-5 text-gray-900 peer-focus:text-blue-500" />
                </div>
                <div className="relative">
                    <input
                        id='accountno'
                        type="password"
                        name="accountno"
                        className='peer w-80 md:w-96 text-gray-900 border-b-2 z-1 outline-none bg-transparent p-2'
                        placeholder='Confirm Account Number'
                        required
                    />
                    <LockClosedIcon className="absolute z-0 right-2 top-2.5 h-5 w-5 text-gray-900 peer-focus:text-blue-500" />
                </div>
                <div className="relative">
                    <input
                        id='ifsc'
                        type="text"
                        name="ifsc"
                        className='peer w-80 md:w-96 text-gray-900 border-b-2 z-1 outline-none bg-transparent p-2'
                        placeholder='IFSC Number'
                        required
                    />
                    <IdentificationIcon className="absolute z-0 right-2 top-2.5 h-5 w-5 text-gray-900 peer-focus:text-blue-500" />
                </div>
                <div className="relative">
                    <input
                        id='name'
                        type="text"
                        name="name"
                        className='peer w-80 md:w-96  text-gray-900 border-b-2 z-1 outline-none bg-transparent p-2'
                        placeholder='Account Holder Name'
                        required
                    />
                    <UserIcon className="absolute z-0 right-2 top-2.5 h-5 w-5 text-gray-900 peer-focus:text-blue-500" />
                </div>
                <div className="relative">
                    <input
                        id='bankname'
                        type="text"
                        name="bankname"
                        className='peer w-80 md:w-96  text-gray-900 border-b-2 z-1 outline-none bg-transparent p-2'
                        placeholder='Bank Name'
                        required
                    />
                    <OfficeBuildingIcon className="absolute z-0 right-2 top-2.5 h-5 w-5 text-gray-900 peer-focus:text-blue-500" />
                </div>
                <div>
                    <button className='bg-secondary-light px-14 py-1 md:px:20 md:py-2 rounded-lg font-semibold'>
                        submit
                    </button>
                </div>
            </div>
            </form>
        </div>
    )
}

export default Bank_form
