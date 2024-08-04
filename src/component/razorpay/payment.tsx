"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import httpClient from "@/app/httpClient";

interface PaymentProps {
  price: number;
  fromride: boolean;
  rideid: Number
}

interface Window {
  Razorpay: any;
}

const Payment: React.FC<PaymentProps> = ({ price, fromride, rideid}) => {
  const [amount, setAmount] = useState<Number>(0);
  const [currency, setCurrency] = useState<String>("INR");
  const [loading, setLoading] = useState<Boolean>(false);
  const [payment, setPayment] = useState<Boolean>(false)

  useEffect(()=>{
    const getpayment = async() =>{
      const response = await httpClient.post('ride/getpayment',{'rideid':rideid})
      console.log(response.data['message'])
      if (response.data['message'] === 'payment done'){
        setPayment(true)
      }
    }
    getpayment()
  },[rideid])

  const createOrderId = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount : price * 100,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      console.log(data)
      return data.orderId;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };
  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const orderId: string = await createOrderId();
      const options = {
        key: process.env.NEXT_PUBLIC_REACT_APP_RAZORPAY_API_KEY,
        amount: price * 100,
        currency: currency,
        name: 'CabQuest',
        description: "Make your ride easy",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };
          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          console.log(result)
          const res = await result.json();
          if (res.isOk) {
            const response = await httpClient.post('ride/paymentdone',{'rideid':rideid})
            console.log(response.data)
            setPayment(true)
          } else {
            alert(res.message);
          }
        },
        prefill: {
          name: 'dfasdfasdfasd',
          email: 'asdfasdfasdfasd',
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <section className=" ">
        <form
          className=""
          onSubmit={processPayment}
        >{payment?
null          :
          <button type="submit" className="text-white bg-black p-2 rounded-md mb-2 w-full">Pay Now</button>
        }
        </form>
      </section>
    </>
  );
}

export default Payment;