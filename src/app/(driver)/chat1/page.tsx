'use client'
// import Header from '@/component/driver/driver_header/header';
// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:9641'); // Adjust URL as needed

// const DriverChat = () => {
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
//     socket.emit('send_message', { room, message, sender: 'driver' });
//     setMessage('');
//   };
//   const chatContainerRef = useRef(null);

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
//     overflowY: 'scroll',  // Ensure scrolling works
//   };

//   return (
//     <div className='h-screen bg-secondary'>
//       <Header/>
//     <div className='w-full flex flex-col justify-center h-4/5 items-center bg-secondary'>
//       <div className='h-3/4 w-1/4 flex justify-end flex-col p-2 bg-gray-800 border-8 border-gray-500 rounded-lg'>
//         <div
//           ref={chatContainerRef}
//           style={hideScrollbarWebkitStyle}
//           className='p-2 flex w-full flex-col'
//         >
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`text-white w-full flex mt-2 flex-col ${
//                 msg.sender === 'driver' ? 'text-end' : 'text-start'
//               }`}
//             >
//               <strong>{msg.sender}</strong>
//               {msg.message}
//             </div>
//           ))}
//         </div>
//         <div className='mt-2 flex justify-center'>
//           <input
//             className='p-2 bg-gray-400 text-black focus:outline-none rounded-2xl w-full font-bold'  
//             type='text'
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <button
//             className='p-3 bg-gray-700 rounded-2xl ml-2 text-white text-sm'
//             onClick={sendMessage}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default DriverChat;
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Header from '@/component/driver/driver_header/header';
import { jwtDecode } from 'jwt-decode';

const socket = io('http://localhost:9641'); // Adjust URL as needed

const DriverChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('room1'); // Define the room for the chat
  // const driverEmail = localStorage.getItem('driverEmail'); // Retrieve driver email
  const userEmail = localStorage.getItem('userEmail'); // Retrieve user email
  const chatContainerRef = useRef(null);
  const token = localStorage.getItem('daccessToken');

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
        socket.emit('send_message', { room, message, sender: 'driver', user_id: userEmail, driver_id: email });
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
    overflowY: 'scroll',  // Ensure scrolling works
  };

  return (
    <div className='h-screen bg-secondary'>
      <Header />
      <div className='w-full flex flex-col justify-center h-4/5 items-center bg-secondary'>
        <div className='h-3/4 w-1/4 flex justify-end flex-col p-2 bg-gray-800 border-8 border-gray-500 rounded-lg'>
          <div
            ref={chatContainerRef}
            style={hideScrollbarWebkitStyle}
            className='p-2 flex w-full flex-col'
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`text-white w-full flex mt-2 flex-col ${
                  msg.sender === 'driver' ? 'text-end' : 'text-start'
                }`}
              >
                <strong>{msg.sender}</strong>
                {msg.message}
              </div>
            ))}
          </div>
          <div className='mt-2 flex justify-center'>
            <input
              className='p-2 bg-gray-400 text-black focus:outline-none rounded-2xl w-full font-bold'
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className='p-3 bg-gray-700 rounded-2xl ml-2 text-white text-sm'
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

export default DriverChat;
