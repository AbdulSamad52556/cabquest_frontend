'use client'
import Image from "next/image";
import Header from "../component/user/header/header";
import Banner from "../component/user/banner/banner";
import Body from "@/component/user/body/body";
import Footer from "@/component/user/footer/footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";

export default function Home() {
  useEffect(()=>{

    try{
      
      const loading = localStorage.getItem('loading')
      const loading2 = localStorage.getItem('logout')
      if (loading){
        toast(loading, { type: 'success', theme: 'dark', hideProgressBar: true, pauseOnHover: false, })
        const timer = setTimeout(() => {
          localStorage.removeItem('loading')
        }, 1000);
      }
      else if (loading2){
        if (loading2){
          toast('logout successfully', { type: 'success', theme: 'dark', hideProgressBar: true, pauseOnHover: false, })
          const timer = setTimeout(() => {
            localStorage.removeItem('logout')
          }, 1000);
      }}
    }catch{
    }
      
  },[])
  return (
    <>
    <Header />
    <ToastContainer />
    <Banner />
    <Body />
    <Footer/>
    </>
  );
}
