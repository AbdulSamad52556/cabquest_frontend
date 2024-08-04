import { useEffect } from 'react';

interface PayPalButtonProps {
  createOrder: () => Promise<string>;
  onApprove: (data: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ createOrder, onApprove }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_REACT_APP_PAYPAL_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      window.paypal.Buttons({
        createOrder: async () => {
          const orderID = await createOrder();
          return orderID;
        },
        onApprove: async (data: any) => {
          onApprove(data);
        }
      }).render('#paypal-button-container');
    };
    document.body.appendChild(script);
  }, [createOrder, onApprove]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
