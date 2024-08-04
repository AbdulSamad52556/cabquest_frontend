'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';

const PaymentComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/create_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 50000 }) 
      });
      const data = await res.json();

      if (data && data.id) {
        const options = {
          key: process.env.NEXT_PUBLIC_REACT_APP_RAZORPAY_API_KEY, 
          amount: data.amount,
          currency: 'INR',
          name: 'Your Company Name',
          description: 'Test Transaction',
          order_id: data.id,
          handler: async function (response: any) {
            const verifyRes = await fetch('/api/verify_payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                order_id: response.razorpay_order_id
              })
            });
            const verifyData = await verifyRes.json();

            if (verifyData.status === 'success') {
              toast.success('Payment successful');
            } else {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            contact: '9999999999'
          }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } else {
        toast.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay with Razorpay'}
    </button>
  );
};

export default PaymentComponent;
