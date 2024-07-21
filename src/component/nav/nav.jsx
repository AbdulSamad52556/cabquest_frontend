import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import image from '../../../public/static/WhatsApp_Image_2024-06-05_at_23.43.42_16f84c9f-removebg-preview.png'

const Nav = () => {
  return (
    <>
      <nav className="mx-auto flex max-w-full items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="m-1.5 p-1.5">
            <Image className="h-10 w-auto" src={image} alt="example"/>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Nav
