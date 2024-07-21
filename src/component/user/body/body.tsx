import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import image from '../../../../public/static/240_F_111928864_4udzV1CbK1O8jA96wenKe4LEVqiebuzV.jpg'
import image2 from '../../../../public/static/240_F_522654963_9emxRwsrpv1ZDpEiZ455gG1W96XuvRWv.jpg'
import image3 from '../../../../public/static/dream_TradingCard__3_-removebg-preview.png'

const Body = () => {
  return (
    <div className='h-150vh w-full bg-white text-black'>

      <div className='flex justify-center items-center  h-1/3 w-full'>
        <div className='w-1/2 flex justify-center'>
          <Image src={image} alt='' className='' />
        </div>
        <div className='flex flex-col items-center gap-7 w-1/2'>
          <h1 className='text-xl text-center md:text-3xl lg:text-4xl xl:text-5xl font-bold'>Drive your dreams, <br />Steer your journey</h1>
          <Link href={'/login_driver'}><button className='bg-primary text-white text-center px-4 py-2 md:px-10 md:py-2 lg:px-14 lg:py-4 text-sm rounded-md'>start</button></Link>

        </div>
      </div>


      <div className='flex justify-around items-center w-full h-1/3'>
        <div className='flex flex-col items-center w-1/2 gap-7'>
          <h1 className='text-xl md:text-3xl text-center lg:text-4xl xl:text-5xl font-bold'>Your ride awaits</h1>
          <Link href={'/'}><button className='bg-primary text-white text-center px-4 py-2 md:px-10 md:py-2 lg:px-14 lg:py-4 text-sm rounded-md'>Book Now</button></Link>

        </div>
        <div className='w-1/2 flex justify-center'>
          <Image src={image2} alt='' />
        </div>
      </div>



      <div className='flex justify-center items-center h-1/3'>
        <div className='w-1/2 flex justify-center'>
          <Image src={image3} alt='' className='w-40 md:w-60' />
        </div>
        <div className='flex flex-col items-center w-1/2 gap-7'>
          <h1 className='text-xl md:text-3xl text-center lg:text-4xl xl:text-5xl font-bold'>Why let your car sit idle?<br />
            Rent it out and watch <br />
            your income grow!</h1>
          <Link href={'/'}><button className='bg-primary text-white text-center px-4 py-2 md:px-10 md:py-2 lg:px-14 lg:py-4 text-sm rounded-md'>Book Now</button></Link>

        </div>

      </div>
    </div>
  )
}

export default Body
