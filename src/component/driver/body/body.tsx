'use client'
import httpClient from '@/app/httpClient';
import axios from 'axios';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation';

const Body = () => {
    const [files, setFiles] = useState<Map<number, File>>(new Map());
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const names = ["Driving License", "Profile Photo", "Aadhar Card", "PAN Card", "Registration Certificate (RC)", "Insurance"];
    const navigate = useRouter();
    const [spin, setSpin] = useState(false)


    useEffect(() => {
        try {

            const token = localStorage.getItem('daccessToken');
            const fullname = localStorage.getItem('dname');
            if (token && fullname) {
                setFullname(fullname);
                const decodedToken = jwtDecode(token);
                setEmail(decodedToken.sub || '');
            }
        }
        catch {
            console.log('helllo')
        }
    }, []);

    useEffect(() => {
        const verify = async () => {
            try {
                if (email) {
                    const response1 = await httpClient.post('/auth/verify_register', { 'email': email });
                    if (response1.data['message'] === 'registration already recorded') {
                        navigate.push('/select_vehicle');
                    } else {
                        setSpin(true)
                    }
                }
            } catch (error) {
                console.error("Verification error:", error);
            }
        };
        verify();
        console.log(files)
    }, [email, navigate, files]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setFiles((prevFiles) => new Map(prevFiles.set(index, file)));
        }
    };

    const submitDoc = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        const formData = new FormData();

        files.forEach((file, index) => {
            formData.append(names[index], file);
        });
        formData.append('email', email);

        try {
            console.log('form data: ', formData)

            const response = await httpClient.post('/auth/driver_kyc', formData, {
                // const response = await axios.post('https://api.cabquest.quest/auth/driver_kyc', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response);
            if (response.data.message === "files successfully uploaded" || response.data.message === 'details already recorded') {
                toast.success(response.data['message']);
                setTimeout(() => {
                    navigate.push('/select_vehicle');
                }, 1000);
            } else {
                toast.error(response.data['message']);
            }
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    if (!spin) {
        return (
            <div className='bg-white w-full h-screen flex justify-center items-center'>
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <div className="h-full w-full flex flex-col bg-white gap-5 items-center justify-center p-10">
            <div>
                <h1 className='text-3xl md:text-5xl text-center font-bold'>Welcome, {fullname}</h1>
            </div>
            <div>
                <h2 className='text-center text-xl font-semibold'>here what you need to do to setup your account</h2>
            </div>
            <div className='fixed'>
                <Toaster position='top-right' />
            </div>
            <form onSubmit={submitDoc} className='w-full h-full flex flex-col gap-5 justify-center items-center'>
                {names.map((name, index) => (
                    <label
                        key={index}
                        className="bg-secondary w-full md:w-3/5 lg:w-2/5 rounded-md h-12 md:h-16 lg:h-20 flex items-center justify-center cursor-pointer relative"
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-md"
                            onChange={(e) => handleFileChange(e, index)}
                            required
                        />
                        <div className="flex items-center rounded-md">
                            <h1 className="text-white mr-2">{name}</h1>
                            {files.has(index) && (
                                <svg
                                    className="w-6 h-6 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            )}
                        </div>
                    </label>
                ))}
                <button className='bg-secondary-light text-black font-medium rounded-xl px-14 py-2' type='submit'>register</button>
            </form>
        </div>
    );
}

export default Body;
