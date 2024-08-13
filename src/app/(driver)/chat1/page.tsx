'use client'
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Header from '@/component/driver/driver_header/header';
import { jwtDecode } from 'jwt-decode';
import httpClient from '@/app/httpClient';
import { ArrowCircleRightIcon } from '@heroicons/react/solid';

const socket = io('http://localhost:9641');

interface DecodedToken {
  sub: string;
}

interface Message {
  message: string;
  sender: 'driver' | 'user';
}

const DriverChat = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<number>(0);
  const [userid, setUserid] = useState<number>(0);
  const [driverid, setDriverid] = useState<number>(0);
  const [rideid, setRideid] = useState<number>(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('daccessToken');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('daccessToken');
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const email = decodedToken.sub;
      const getrideid = async () => {
        const response = await httpClient.post('communication/getrideid', { 'email': email })
        console.log(response.data)
        setDriverid(response.data['driverid'])
        setUserid(response.data['userid'])
        setRideid(response.data['rideid'])
        setRoom(response.data['rideid'])
        setName(response.data['name'])
        const response2 = await httpClient.get(`communication/messages/${response.data['rideid']}`)
      console.log(response.data)
      setMessages(response2.data)
      }
      getrideid();

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
    };

    setRoom(rideid);
    const cleanupSocket = initializeSocket(rideid);
    return cleanupSocket;

  }, [room, rideid]);

 


  const sendMessage = () => {
    console.log(room, message, userid, driverid)
    socket.emit('send_message', { 'room': room, 'message': message, 'sender': 'driver', 'user_id': userid, 'driver_id': driverid });
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
  };

  return (
    <div className='h-screen bg-secondary'>
      <Header />

      <div className='w-full flex flex-col justify-center items-center h-4/5 bg-white'>
        <div className='w-2/4 p-4 bg-gray-700 rounded-t-lg shadow-xl shadow-gray-500'>

          <h1 className='text-start text-gray-300 font-semibold'>USER: {name}</h1>
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
                className={` w-full flex mt-2 flex-col ${msg.sender === 'driver' ? 'items-end ' : 'items-start'
                  }`}
              >
                <div className={`text-sm ${msg.sender === 'driver' ? 'bg-blue-600 text-white' : 'bg-gray-400'} rounded-2xl text-black size-fit p-2`}>

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

export default DriverChat;
