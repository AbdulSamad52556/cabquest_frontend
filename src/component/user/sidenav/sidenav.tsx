'use client'
import React, { useRef, useState, FormEvent } from 'react';
import { ArrowCircleDownIcon, LocationMarkerIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import image from '../../../../public/static/navigation.png';
import image2 from '../../../../public/static/Eclipse@1x-1.0s-200px-200px (2).gif';

interface SidenavProps {
  onButtonClick: () => void;
  Autocomplete: React.ComponentType<any>; // Adjust the type for Autocomplete component
  result: (results: google.maps.DirectionsResult | null, duration: string, distance: string) => void;
  placename: string;
}

const Sidenav: React.FC<SidenavProps> = ({ onButtonClick, Autocomplete, result, placename }) => {
  const [accordion, setAccordion] = useState(false);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [directionResponse, setDirectionResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [searchspin, setSearchspin] = useState(false);

  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  const showAccordion = () => {
    setAccordion(!accordion);
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!originRef.current || !destinationRef.current || !originRef.current.value || !destinationRef.current.value) {
      return;
    }
    const directionService = new google.maps.DirectionsService();
    try {
      const request: google.maps.DirectionsRequest = {
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
      };
      const results = await directionService.route(request);
      setDirectionResponse(results);
      setDistance(results.routes[0].legs[0].distance?.text || '');
      setDuration(results.routes[0].legs[0].duration?.text || '');
      result(results, results.routes[0].legs[0].duration?.text || '', results.routes[0].legs[0].distance?.text || '');
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const getplacename = () => {
    if (originRef.current) {
      originRef.current.value = placename;
    }
  };

  return (
    <div className="p-5 flex flex-col justify-center w-full items-center gap-10">
      <form className="w-3/4 max-w-lg" onSubmit={handleSearch}>
        <div className="flex flex-col gap-4">
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <div className="relative w-full">
              <input
                type="text"
                className="p-4 rounded-md focus:outline-none w-full text-white"
                placeholder="Enter Location"
                ref={originRef}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={getplacename}
              >
                <LocationMarkerIcon className="w-6 h-6" />
              </button>
            </div>
          </Autocomplete>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              className="p-4 rounded-md focus:outline-none w-full text-white"
              placeholder="Enter Destination"
              ref={destinationRef}
              required
            />
          </Autocomplete>

          <button
            type="button"
            className="bg-black text-white p-4 w-full flex rounded-md justify-between items-center"
            onClick={showAccordion}
          >
            Pick Up Time (optional)
            <ArrowCircleDownIcon className={`w-6 h-6 ${accordion ? 'transform rotate-180' : ''}`} />
          </button>

          {accordion && (
            <div className="w-full px-2 transition-all duration-300">
              <input type="date" className="w-full p-3 mb-1 rounded-md focus:outline-none" />
              <input type="time" className="w-full p-3 rounded-md focus:outline-none" />
            </div>
          )}

          {searchspin ? (
            <button type="submit" className="bg-primary text-white p-2 rounded-lg flex justify-center items-center" disabled={true}>
              <Image src={image2} alt="" className="w-7" />
            </button>
          ) : (
            <button type="submit" className="bg-primary text-white p-2 rounded-lg">
              Search
            </button>
          )}
        </div>
      </form>
      <div className="w-full flex justify-center">
        <button onClick={onButtonClick} className="bg-primary-light text-white p-2 rounded-lg text-center">
          <Image src={image} className="w-5" alt="" />
        </button>
      </div>
    </div>
  );
};

export default Sidenav;
