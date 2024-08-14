'use client'
import Header from "../component/user/header/header";
import Banner from "../component/user/banner/banner";
import Body from "@/component/user/body/body";
import Footer from "@/component/user/footer/footer";
import { Toaster, toast } from 'sonner'
import { useEffect } from "react";

const Home: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const loading = localStorage.getItem('loading')
        const loading2 = localStorage.getItem('logout')
        if (loading) {
          toast.success(loading)
          localStorage.removeItem('loading')
        } else if (loading2) {
          toast.success('logout successfully')
          localStorage.removeItem('logout')
        }
      } catch {
      }
    }
  }, [])

  return (
    <>
      <Header />
      <Toaster position="top-right" richColors />
      <Banner />
      <Body />
      <Footer />
    </>
  );
}

export default Home;
