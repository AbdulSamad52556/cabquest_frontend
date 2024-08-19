import React, { useState } from 'react';
import { MinusSmIcon } from '@heroicons/react/solid'
import httpClient from '@/app/httpClient';
import { Toaster, toast } from 'sonner'


const VehicleTypeForm: React.FC = () => {
  const [formData, setFormData] = useState({
    type: '',
    base_price: '',
    base_distance_KM: '',
    price_per_km: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const jsonFormData = JSON.stringify(formData);
    const response = await httpClient.post('auth/addvehicle', { jsonFormData })
    console.log(response)
    if (response.data['message'] === 'vehicle successfully added') {
      toast.success(response.data['message'])
      setFormData(
        {
          type: '',
          base_price: '',
          base_distance_KM: '',
          price_per_km: '',
        }
      )
    } else {
      toast.error(response.data['message'])
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-300 shadow-md rounded-lg p-6 mt-10 relative">
      <div className='fixed'>
        <Toaster position='top-right' />
      </div>

      <h2 className="text-2xl font-bold mb-6 text-territory text-center">Add Vehicle Type</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Vehicle Type
          </label>
          <input
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            id="type"
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="base_price">
            Base Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            id="base_price"
            type="number"
            step="0.01"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="base_distance_KM">
            Base Distance (KM)
          </label>
          <input
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            id="base_distance_KM"
            type="number"
            name="base_distance_KM"
            value={formData.base_distance_KM}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price_per_km">
            Price per KM
          </label>
          <input
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            id="price_per_km"
            type="number"
            step="0.01"
            name="price_per_km"
            value={formData.price_per_km}
            onChange={handleChange}
            required
          />
        </div>
        {/* <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Image">
              Image URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="Image"
              type="text"
              name="Image"
              value={formData.Image}
              onChange={handleChange}
            />
          </div> */}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleTypeForm;