'use client'
import httpClient from '@/app/httpClient';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Webcam from 'react-webcam';
import 'react-toastify/dist/ReactToastify.css';

interface Vehicle {
  id: number;
  type: string;
  base_price: string;
  base_distance_KM: number;
  price_per_KM: string;
}

const VehicleBody = () => {

  const [files, setFiles] = useState<Map<number, File>>(new Map());
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [names, setNames] = useState([]);
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [plate, setPlate] = useState('')
  const [loading, setLoading] = useState(true);
  const navigate = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    try {

      const token = localStorage.getItem('daccessToken');
      if (!token){
      navigate.push('/login_driver')

      }
    } catch {
      navigate.push('/login_driver')
    }

    

  useEffect(() => {
    const fetchVehicles = async () => {

      try {
        setLoading(true);
        const response = await httpClient.get<Vehicle[]>('auth/vehicle');
        setVehicles(response.data); 
        const vehicleNames = response.data.map(vehicle => vehicle.type); 
        setNames(vehicleNames);
        setTimeout(() => {
          setLoading(false);

        }, 100);
      } catch (error) {
        toast('Error fetching vehicles', { type: 'error', theme: 'dark', hideProgressBar: true, pauseOnHover: false, });
      }
    };

    fetchVehicles();
  }, []);


  const getemail = () =>{
    const token = localStorage.getItem('daccessToken');

    console.log('tokens: ',token)
    const decodedToken = jwtDecode(token);
    const email = decodedToken.sub;
    return email
  }


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFiles((prevFiles) => new Map(prevFiles.set(index, file)));
    }
  };
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setIsCameraOpen(false)
    console.log(imageSrc)
  }, [webcamRef]);

  const handleOpenCamera = () => {
    setIsCameraOpen(!isCameraOpen);
    setImage(null)
  };

  const handleRadioChange = (name: string) => {
    setSelectedIndex(name);
  };

  const submitDoc = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    
    const email = getemail();

    const data = {
      'type': selectedIndex,
      'model': model,
      'year': year,
      'plate': plate,
      'email': email
    }
    const response = await httpClient.post('auth/vehicle', data)
    if (response.data['message'] === "Successfully added") {
      toast(response.data['message'], { type: 'success', theme: 'dark', hideProgressBar: true, pauseOnHover: false, })
      const timer = setTimeout(() => {
        navigate.push('/verification_pending')
      }, 1000);
    }
    else {
      toast(response.data['message'], { type: 'error', theme: 'dark', hideProgressBar: true, pauseOnHover: false, })
    }
  };

  if (names.length === 0) {
    return (
      <div className='w-full h-full flex justify-center p-20'>
        <h2>Data is unavailable, Try again some time.... </h2>
      </div>
    )
  }


  return (
    <div className=" w-full flex flex-col bg-white gap-5 items-center justify-center p-10">
      <div>
        <h1 className="text-3xl md:text-4xl text-black text-center font-bold">Select Your Vehicle Type</h1>
      </div>
      <ToastContainer />
      <form action="" onSubmit={submitDoc} className='w-full h-full flex flex-col justify-center items-center gap-5'>
        {loading ?
          (
            <div className='flex justify-center items-center h-full'>
              <span className="loading loading-dots loading-md"></span>
            </div>
          ) : (

            names.map((name, index) => (
              <label
                key={name}
                className={`bg-secondary w-full md:w-3/5 lg:w-2/5 h-20 flex text-white items-center justify-between cursor-pointer relative rounded-md px-4 ${selectedIndex === name ? 'border-4 border-blue-500' : ''
                  }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="document_type"
                    className="mr-2 bg-white text-black"
                    onChange={() => handleRadioChange(name)}
                    checked={selectedIndex === name}
                    required
                  />
                  <h1 className="text-white mr-2">{name}</h1>
                </div>
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
                {selectedIndex === name && (
                  <input
                    type="radio"
                    className="absolute inset-0 w-full bg-white h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e, index)}
                  />
                )}
              </label>
            )))
        }

        <h1 className='text-2xl bg-white font-bold'>Enter your vehicle details</h1>
        <div className="flex flex-col gap-2 justify-start items-end">
          <table className="border-collapse w-full">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="model">Model:</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    onChange={(e) => setModel(e.target.value)}
                    className="border-gray-400 border-2 p-2 text-black bg-white rounded-md w-full"
                    placeholder="e.g., Maruti Suzuki Swift"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="make">Year:</label>
                </td>
                <td>
                  <input
                    type="number"
                    id="make"
                    name="make"
                    maxLength={4}
                    onChange={(e) => setYear(e.target.value)}
                    className="border-gray-400 bg-white text-black border-2 p-2 rounded-md w-full"
                    placeholder="e.g., 2000"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="license">License Plate:</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="license"
                    value={plate}
                    maxLength={10}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    name="license"
                    className="border-gray-400 bg-white text-black border-2 p-2 rounded-md w-full"
                    placeholder="e.g., KL22E2134"
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='flex flex-col justify-center items-center'>
          {isCameraOpen ?
            <button onClick={handleOpenCamera} className='bg-secondary-dark text-white px-20 py-2 rounded-md' type='button'>Close Camera</button>
            :
            <button onClick={handleOpenCamera} className='bg-secondary-dark text-white px-20 py-2 rounded-md'>Upload Photo</button>}
          {image && (
            <div className='bg-gray-600 rounded-lg text-white p-2 flex'>
              <img src={image} alt="Captured" className='rounded-lg' />
            </div>
          )}
          {isCameraOpen && (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={400}
                height={400}
              />
              <button onClick={capture} className='bg-primary-dark text-white px-10 py-2 rounded-md'>Capture photo</button>
            </>
          )}

        </div>

        <button className="bg-secondary-light text-black font-medium rounded-xl px-14 py-2" type='submit'>
          Register
        </button>

      </form>
    </div>

  );
};

export default VehicleBody;
