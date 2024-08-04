import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_REACT_APP_RAZORPAY_API_KEY || '',
    key_secret: process.env.NEXT_PUBLIC_REACT_APP_RAZORPAY_SECRET_KEY || '',
  });

export async function POST(request: NextRequest) {
 const { amount, currency } = (await request.json()) as {
  amount: string;
  currency: string;
 };

  console.log('checkout')
 var options = {
  amount: amount,
  currency: currency,
  receipt: 'rcp1',
 };
 const order = await razorpay.orders.create(options);
 console.log(order);
 return NextResponse.json({ orderId: order.id }, { status: 200 });
}