'use client'
import React,{ useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import httpClient from '@/app/httpClient'
import login from '../../../../public/static/WhatsApp Image 2024-05-29 at 13.54.26_7bb487fb.jpg'
import { MailIcon, LockClosedIcon, LockOpenIcon, UserCircleIcon, PhoneIcon} from '@heroicons/react/solid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from '@/component/nav/nav';

const page = () => {
  const [fullname, setFullname] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [password2,setPassword2] = useState('')
  const [phone, setPhone] = useState('')
  const [lock, setLock] = useState(true)
  const [lock2, setLock2] = useState(true)
  const [passwordType, setPasswordType] = useState('password')
  const [passwordType2, setPasswordType2] = useState('password')

  
  const handleLockClick = () => {
    setLock(!lock);
    if (passwordType === 'password'){
        setPasswordType('text')
      }
    else{
      setPasswordType('password')
    }
  };
  const handleLockClick2 = () => {
    setLock2(!lock2);
    if (passwordType2 === 'password'){
        setPasswordType2('text')
      }
    else{
      setPasswordType2('password')
    }
  };

  const navigate = useRouter();
  
  const handleclick = async (e: { preventDefault: () => void }) =>{
    e.preventDefault()
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).+$/;
    if (password !== password2){
      
        toast("password doesn't match",{type:'error',theme:'dark',hideProgressBar: true,pauseOnHover: false,});
    }
    else if (!regex.test(password)){
        toast("Password doesn't match criteria",{type:'error',theme:'dark',hideProgressBar: true,pauseOnHover: false,})
    }
    else{

      const data = {
        fullname: fullname,
        email: email,
        password: password,
        phone: phone,
      }
        try {
          console.log('request sending');
          const response = await httpClient.post('auth/register', data);
          console.log(response);
          
          toast(response.data['message'],{type:'warning',theme:'dark',hideProgressBar: true,pauseOnHover: false,})
          if (response.data['message'] === "User recorded"){
            const timer = setTimeout(() => {
              navigate.push(`/otp?email=${email}`)
            }, 1500);
            
          }
        } catch (error) {
          console.error('Error:', error);
        }
        
    }
  }
 
  return (
    <div className='bg-primary min-h-fit overflow-hidden '>

    <Nav/>

      <div className='flex w-full justify-center align-center h-screen'>
        <div className='bg-primary w-full md:w-4/5 lg:w-3/5 h-fit sm:m-5 flex flex-col md:flex-row border border-white'>

          <div className='w-full md:w-1/2 flex items-center justify-center hidden md:block lg:block'>
            <div className="relative w-full h-64 md:h-full">
              <Image src={login} alt='Login Image' layout='fill' objectFit='cover' />
            </div>
          </div>

            <div className='flex flex-col gap-5 w-full md:w-1/2 p-2 items-center justify-evenly md:m-3'>
              <h1 className='text-4xl text-white'>SignUp</h1>
              <ToastContainer />
              <form onSubmit={handleclick}>
                <div className='flex flex-col gap-5'>
                <div className="relative">
                    <input
                      id='fullname'
                      autoComplete='off'
                      onChange={(e) => setFullname(e.target.value)}
                      type="text"
                      name="fullname"
                      className='peer text-white border-b-2 outline-none bg-transparent p-2'
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
                      className='peer text-white border-b-2 outline-none bg-transparent p-2'
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
                      className='peer text-white border-b-2 outline-none bg-transparent p-2'
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
                      onChange={(e)=>setPassword(e.target.value)}
                      className='peer text-white border-b-2 outline-none bg-transparent p-2'
                      placeholder='Password'
                      required
                    />
                    {lock  ? (
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
                      className='peer text-white border-b-2 outline-none bg-transparent p-2'
                      placeholder='Confirm Password'
                    />
                    {lock2  ? (
                      <LockClosedIcon onClick={handleLockClick2} className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                    ) : (
                      <LockOpenIcon onClick={handleLockClick2} className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 peer-focus:text-blue-500" />
                    )}
                  </div>
                  <button className='bg-white rounded-xl p-2 text-black'>SignUp</button>
                  <p className='text-center text-sm text-white'>
                    Already have an account? <Link href={'/login'} className='text-blue-600'>login</Link>
                  </p>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  )
}
export default page
