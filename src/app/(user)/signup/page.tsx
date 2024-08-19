'use client'
import React, { useState, FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import httpClient from '@/app/httpClient'
import login from '../../../../public/static/WhatsApp Image 2024-05-29 at 13.54.26_7bb487fb.jpg'
import { MailIcon, LockClosedIcon, LockOpenIcon, UserCircleIcon, PhoneIcon } from '@heroicons/react/solid';
import { Toaster, toast } from 'sonner'
import Nav from '@/component/nav/nav';
import image from '../../../../public/static/Eclipse@1x-0.5s-200px-200px2.gif'

const Page: React.FC = () => {
  const [fullname, setFullname] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [password2, setPassword2] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [lock, setLock] = useState<boolean>(true)
  const [lock2, setLock2] = useState<boolean>(true)
  const [passwordType, setPasswordType] = useState<string>('password')
  const [passwordType2, setPasswordType2] = useState<string>('password')
  const [loading, setLoading] = useState<boolean>(false)

  const handleLockClick = () => {
    setLock(!lock);
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const handleLockClick2 = () => {
    setLock2(!lock2);
    setPasswordType2(passwordType2 === 'password' ? 'text' : 'password');
  };

  const navigate = useRouter();

  const handleClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).+$/;
    if (password !== password2) {
      toast.error("password doesn't match");
    } else if (!regex.test(password)) {
      toast.error("Password doesn't match criteria");
    } else {
      const data = {
        fullname,
        email,
        password,
        phone,
      };

      try {
        console.log('request sending');
        const response = await httpClient.post('auth/register', data);
        console.log(response);
        toast.warning(response.data['message']);
        if (response.data['message'] === "User recorded") {
          const timer = setTimeout(() => {
            navigate.push(`/otp?email=${email}`);
          }, 1500);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setLoading(false);
  };

  return (
    <div className='bg-primary h-screen overflow-hidden '>
      <Nav />
      <div className='flex w-full justify-center items-center h-3/4'>
        <div className='bg-primary w-full md:w-4/5 lg:w-3/5 h-fit sm:m-5 flex flex-col md:flex-row justify-center md:border border-white'>
          <div className='w-full md:w-1/2 items-center justify-center hidden md:block lg:block'>
            <div className="relative w-full h-64 md:h-full">
              <Image src={login} alt='Login Image' layout='fill' objectFit='cover' />
            </div>
          </div>
          <div className='flex flex-col gap-5 w-full md:w-1/2 p-2 items-center justify-center md:m-3'>
            <h1 className='text-4xl text-white'>SignUp</h1>
            <div className='fixed'>
              <Toaster position='top-right' />
            </div>
            <form onSubmit={handleClick}>
              <div className='flex flex-col gap-5'>
                <div className="relative">
                  <input
                    id='fullname'
                    autoComplete='off'
                    onChange={(e) => setFullname(e.target.value)}
                    type="text"
                    name="fullname"
                    className='peer w-80  text-white border-b-2 outline-none bg-transparent p-2'
                    placeholder='FullName'
                    required
                  />
                  <UserCircleIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                </div>
                <div className="relative">
                  <input
                    id='email'
                    autoComplete='off'
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    className='peer w-80 text-white border-b-2 outline-none bg-transparent p-2'
                    placeholder='Email'
                    required
                  />
                  <MailIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                </div>
                <div className="relative">
                  <input
                    type="phone"
                    name='phone'
                    id='phone'
                    onChange={(e) => setPhone(e.target.value)}
                    className='peer w-80 text-white border-b-2 outline-none bg-transparent p-2'
                    placeholder='Phone'
                    required
                  />
                  <PhoneIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                </div>
                <div className="relative">
                  <input
                    type={passwordType}
                    name='pass'
                    id='pass'
                    onChange={(e) => setPassword(e.target.value)}
                    className='peer w-80 text-white border-b-2 outline-none bg-transparent p-2'
                    placeholder='Password'
                    required
                  />
                  {lock ? (
                    <LockClosedIcon onClick={handleLockClick} className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                  ) : (
                    <LockOpenIcon onClick={handleLockClick} className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                  )}
                </div>
                <div className="relative">
                  <input
                    type={passwordType2}
                    name='pass'
                    id='pass'
                    onChange={(e) => setPassword2(e.target.value)}
                    className='peer w-80 text-white border-b-2 outline-none bg-transparent p-2'
                    placeholder='Confirm Password'
                  />
                  {lock2 ? (
                    <LockClosedIcon onClick={handleLockClick2} className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                  ) : (
                    <LockOpenIcon onClick={handleLockClick2} className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                  )}
                </div>
                {loading ?
                  <div className='bg-white rounded-xl p-2 text-black flex justify-center'>
                    <Image className='w-6' src={image} alt='' />
                  </div>
                  :
                  <button className='bg-white rounded-xl p-2 text-black'>SignUp</button>}
                <p className='text-center text-sm text-white'>
                  Already have an account? <Link href={'/login'} className='text-blue-600'>login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
