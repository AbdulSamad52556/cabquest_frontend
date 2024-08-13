import React from 'react'
import Header from '@/component/driver/driver_header/header'
import Bank_form from '@/component/driver/bank_form/bank_form'


const Page = () => {
  return (
    <div>
        <div className='bg-secondary'>

      <Header/>
        </div>
        <div>
            <Bank_form/>
        </div>
    </div>
  )
}

export default Page
