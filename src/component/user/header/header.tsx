'use client'
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import image from '../../../../public/static/WhatsApp_Image_2024-06-05_at_23.43.42_16f84c9f-removebg-preview.png'
import image2 from '../../../../public/static/WhatsApp Image 2024-06-06 at 10.26.33_cb208a6f.jpg'

const Header = () => {
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(false);
    setIsModalOpen(!isModalOpen);
  };

  const accessToken = localStorage.getItem('accessToken')

  const fullname = localStorage.getItem('name')

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const signOut = () =>{
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('name')
    localStorage.setItem('logout','true')
    window.location.reload();
  }


  return (

    <div className="bg-primary">
      <nav className="mx-auto flex max-w-full items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image className="h-10 w-auto" src={image} alt="example" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/ride" className="text-sm font-semibold leading-6 text-white hover:scale-105">Ride</Link>
          <Link href="/login_driver" className="text-sm font-semibold leading-6 text-white hover:scale-105 ">Drive</Link>
          <Link href="/" className="text-sm font-semibold leading-6 text-white hover:scale-105">About Us</Link>
          <Link href="/" className="text-sm font-semibold leading-6 text-white hover:scale-105">Contact Us</Link>
        </div>



        {isModalOpen && (
        <div id="popup-modal" className="overflow-y-auto overflow-x-hidden fixed z-50 flex justify-center items-center w-full inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-territory rounded-lg shadow ">
              <button
                type="button"
                onClick={toggleModal}
                className="absolute top-3 end-2.5 text-gray-800 bg-transparent hover:bg-gray-700  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-900 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-900 dark:text-gray-800">Are you sure you want to logout?</h3>

                <button
                  onClick={signOut}
                  type="button"
                  className="text-white hover:bg-primary-dark bg-blue-500 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Yes, I'm sure
                </button>

                <button
                  onClick={toggleModal}
                  type="submit"
                  className="py-2.5 px-5 ms-3 text-sm font-medium focus:outline-none bg-white rounded-lg border border-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-300 dark:text-gray-800 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  No, cancel
                </button>

              </div>
            </div>
          </div>
        </div>
      )}



        {accessToken ?
          <div className="hidden lg:flex lg:flex-1 gap-5 lg:justify-end">
            <div className="realtive  inline-block text-left" ref={menuRef}>
              <div>
                <button
                  type="button"
                  className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  id="menu-button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={toggleDropdown}
                >
                  {fullname?fullname:null}
                  <svg
                    className="-mr-1 h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {isOpen && (
                <div
                  className="absolute right-10 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  <div className="py-1" role="none">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      id="menu-item-0"
                    >
                      Account settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      id="menu-item-1"
                    >
                      Profile
                    </a>
                    
                      <button
                        type="submit"
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                        role="menuitem"
                        id="menu-item-3"
                        onClick={toggleModal}
                      >
                        Sign out
                      </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          :
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link href="/signup" className="text-md font-semibold leading-6 mr-10 text-white hover:scale-105">SignUp</Link>
            <Link href="/login" className="text-md font-semibold leading-6 text-white hover:scale-105">LogIn </Link>
          </div>}


      </nav>





      {isMobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10"></div>
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image className="h-8 w-auto" src={image2} alt="example" />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <div className="-mx-3">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      aria-controls="disclosure-1"
                      aria-expanded={isProductMenuOpen}
                      onClick={() => setIsProductMenuOpen(!isProductMenuOpen)}
                    >
                      Product
                      <svg className="h-5 w-5 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {isProductMenuOpen && (
                      <div className="mt-2 space-y-2" id="disclosure-1">
                        <Link href="/analytics" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Analytics</Link>
                        <Link href="/engagement" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Engagement</Link>
                        <Link href="/security" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Security</Link>
                        <Link href="/integrations" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Integrations</Link>
                        <Link href="/automations" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Automations</Link>
                        <Link href="/watch-demo" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Watch demo</Link>
                        <Link href="/contact-sales" className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">Contact sales</Link>
                      </div>
                    )}
                  </div>
                  <Link href="/features" className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Features</Link>
                  <Link href="/marketplace" className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Marketplace</Link>
                  <Link href="/company" className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Company</Link>
                </div>
                <div className="py-6">
                  {accessToken?<button onClick={toggleModal} className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-50">signOut</button>:
                  <Link href="/login" className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-50">Log in</Link>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>


  )
}

export default Header
