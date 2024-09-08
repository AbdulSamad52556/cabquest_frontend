'use client'
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Image from 'next/image';
import Link from 'next/link';
import image from '../../../../public/static/WhatsApp_Image_2024-06-05_at_23.43.42_16f84c9f-removebg-preview.png';
import { jwtDecode } from 'jwt-decode';
import httpClient from '@/app/httpClient';
import { ArrowCircleRightIcon } from '@heroicons/react/solid';


// const socket = io('http://localhost:9641');
const socket = io('https://communication.cabquest.quest');

interface DecodedToken {
  sub: string;
}


interface Message {
  message: string;
  sender: 'user' | 'driver';
}

const UserChat = () => {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<number>(0);
  const [userid, setUserid] = useState<number>(0);
  const [driverid, setDriverid] = useState<number>(0);
  const [rideid, setRideid] = useState<number>(0);
  const [name, setName] = useState<string>('');



  useEffect(() => {
    if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const email = decodedToken.sub;
      const getrideid = async () => {
        const response = await httpClient.post('communication/getrideid2', { 'email': email })
        setDriverid(response.data['driverid'])
        setUserid(response.data['userid'])
        setRideid(response.data['rideid'])
        setRoom(response.data['rideid'])
        setName(response.data['name'])
        const response2 = await httpClient.get(`communication/messages/${response.data['rideid']}`)
        setMessages(response2.data)
      }
      getrideid();
    }
  }
  }, [])

  useEffect(() => {

    const initializeSocket = (id: number): (() => void) => {
      socket.emit('join', { room });

      socket.on('receive_message', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

    
      
      return () => {
        socket.emit('leave', { room });
        socket.off('receive_message');
      };
    }

    setRoom(rideid);
    const cleanupSocket = initializeSocket(rideid);
    return cleanupSocket;

  }, [room, rideid]);


  const sendMessage = () => {
    socket.emit('send_message', { room, message, sender: 'user', user_id: userid, driver_id: driverid });
    setMessage('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const hideScrollbarStyle: React.CSSProperties = {
    msOverflowStyle: 'none', 
    scrollbarWidth: 'none', 
  };

  const hideScrollbarWebkitStyle: React.CSSProperties = {
    ...hideScrollbarStyle,
    overflowY: 'scroll',
  }

  return (
    <div className='h-screen bg-primary'>
      <nav className="mx-auto flex max-w-full items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="m-1.5 p-1.5">
            <Image className="h-10 w-auto" src={image} alt="example" />
          </Link>
        </div>
      </nav>
      <div className='w-full flex flex-col justify-center items-center h-4/5 bg-white'>
        <div className='w-2/4 p-4 bg-gray-700 rounded-t-lg shadow-xl shadow-gray-500'>

          <h1 className='text-start text-gray-300 font-semibold'>DRIVER: {name}</h1>
        </div>
        <div className='h-3/4 flex w-2/4 justify-end flex-col p-2 bg-white rounded-b-lg shadow-xl shadow-gray-500'>
          <div
            ref={chatContainerRef}
            style={hideScrollbarWebkitStyle}
            className='p-2 flex w-full flex-col'
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={` w-full flex mt-2 flex-col ${msg.sender === 'user' ? 'items-end ' : 'items-start'
                  }`}
              >
                <div className={`text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-400'} rounded-2xl text-black size-fit p-2`}>

                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className='mt-2 flex justify-center'>
            <input
              className='p-2 bg-gray-300 w-full text-black focus:outline-none rounded-xl'
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className='p-2 bg-blue-900 rounded-xl ml-2 text-white text-sm'
              onClick={sendMessage}
            >
              <ArrowCircleRightIcon className="h-5 w-10 text-gray-200" />

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
