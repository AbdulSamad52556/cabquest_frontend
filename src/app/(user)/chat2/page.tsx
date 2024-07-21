'use client'
// import Header from '@/component/user/header/header';
// import Header2 from '@/component/user/header2/header2';
// import Image from 'next/image';
// import Link from 'next/link';
// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
// import image from '../../../../public/static/WhatsApp_Image_2024-06-05_at_23.43.42_16f84c9f-removebg-preview.png'


// const socket = io('http://localhost:9641'); // Adjust URL as needed

// const UserChat = () => {
//   const chatContainerRef = useRef(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [room, setRoom] = useState('room1'); // Define the room for the chat

//   useEffect(() => {
//     socket.emit('join', { room });

//     socket.on('receive_message', (data) => {
//       setMessages((prevMessages) => [...prevMessages, data]);
//     });

//     return () => {
//       socket.emit('leave', { room });
//       socket.off('receive_message');
//     };
//   }, [room]);

//   const sendMessage = () => {
//     socket.emit('send_message', { room, message, sender: 'user' });
//     setMessage('');
//   };


//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const hideScrollbarStyle = {
//     msOverflowStyle: 'none',  // IE and Edge
//     scrollbarWidth: 'none',  // Firefox
//   };
//   const hideScrollbarWebkitStyle = {
//     ...hideScrollbarStyle,
//     overflowY: 'scroll',  
//   };

//   return (
//     <div className='h-screen bg-primary'>
//        <nav className="mx-auto flex max-w-full items-center justify-between p-4 lg:px-8" aria-label="Global">
//         <div className="flex lg:flex-1">
//           <Link href="/" className="m-1.5 p-1.5">
//             <Image className="h-10 w-auto" src={image} alt="example"/>
//           </Link>
//         </div>
//       </nav>
//     <div className='w-full flex flex-col justify-center items-center h-4/5 bg-primary'>
//     <div className='h-3/4 flex w-1/4 justify-end flex-col p-2 bg-gray-800 border-8 border-gray-500 rounded-lg'>
//       <div
//         ref={chatContainerRef}
//         style={hideScrollbarWebkitStyle}
//         className='p-2 flex w-full flex-col'
//       >
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`text-white w-full flex mt-2 flex-col ${
//               msg.sender === 'user' ? 'text-end' : 'text-start'
//             }`}
//           >
//             <strong>{msg.sender}</strong>
//             {msg.message}
//           </div>
//         ))}
//       </div>
//       <div className='mt-2 flex justify-center'>
//         <input
//           className='p-3 bg-gray-400 w-full text-black focus:outline-none rounded-2xl font-bold'
//           type='text'
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button
//           className='p-2 bg-gray-700 rounded-2xl ml-2 text-white text-sm'
//           onClick={sendMessage}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   </div>
//   </div>
//   );
// };

// export default UserChat;
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Header from '@/component/user/header/header';
import Header2 from '@/component/user/header2/header2';
import Image from 'next/image';
import Link from 'next/link';
import image from '../../../../public/static/WhatsApp_Image_2024-06-05_at_23.43.42_16f84c9f-removebg-preview.png';
import { jwtDecode } from 'jwt-decode';

const socket = io('http://localhost:9641'); // Adjust URL as needed

const UserChat = () => {
  const chatContainerRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('room1'); // Define the room for the chat
  const userEmail = localStorage.getItem('userEmail'); // Retrieve user email
  const driverEmail = localStorage.getItem('driverEmail'); // Retrieve driver email
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    socket.emit('join', { room });

    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    fetch(`/messages/${room}`)
      .then(response => response.json())
      .then(data => setMessages(data));

    return () => {
      socket.emit('leave', { room });
      socket.off('receive_message');
    };
  }, [room]);

  const sendMessage = () => {
      if (token) {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub;
    socket.emit('send_message', { room, message, sender: 'user', user_id: email, driver_id: driverEmail });
    setMessage('');
      }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const hideScrollbarStyle = {
    msOverflowStyle: 'none',  // IE and Edge
    scrollbarWidth: 'none',  // Firefox
  };

  const hideScrollbarWebkitStyle = {
    ...hideScrollbarStyle,
    overflowY: 'scroll',  
  };

  return (
    <div className='h-screen bg-primary'>
      <nav className="mx-auto flex max-w-full items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="m-1.5 p-1.5">
            <Image className="h-10 w-auto" src={image} alt="example" />
          </Link>
        </div>
      </nav>
      <div className='w-full flex flex-col justify-center items-center h-4/5 bg-primary'>
        <div className='h-3/4 flex w-1/4 justify-end flex-col p-2 bg-gray-800 border-8 border-gray-500 rounded-lg'>
          <div
            ref={chatContainerRef}
            style={hideScrollbarWebkitStyle}
            className='p-2 flex w-full flex-col'
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`text-white w-full flex mt-2 flex-col ${
                  msg.sender === 'user' ? 'text-end' : 'text-start'
                }`}
              >
                <strong>{msg.sender}</strong>
                {msg.message}
              </div>
            ))}
          </div>
          <div className='mt-2 flex justify-center'>
            <input
              className='p-3 bg-gray-400 w-full text-black focus:outline-none rounded-2xl font-bold'
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className='p-2 bg-gray-700 rounded-2xl ml-2 text-white text-sm'
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
