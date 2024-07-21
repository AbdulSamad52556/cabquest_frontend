import React from 'react'
import Header from '@/component/driver/driver_header/header'
import Notification from '@/component/driver/notification/notification'
const page = () => {
  return (
    <div className='bg-secondary h-screen w-full'>
        <div>

      <Header/>
        </div>
        <div className='bg-secondary h-fit'>
            <Notification/>
        </div>
    </div>
  )
}

export default page
