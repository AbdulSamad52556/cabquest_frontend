import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Success: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const captureOrder = async () => {
      const orderID = router.query.orderID as string;
      if (!orderID) return;

      const response = await fetch('http://localhost:9637/booking/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID })
      });
      const data = await response.json();
      console.log('Capture result:', data);
    };

    if (router.query.orderID) {
      captureOrder();
    }
  }, [router.query.orderID]);

  return <div>Success! Your payment has been processed.</div>;
};

export default Success;
