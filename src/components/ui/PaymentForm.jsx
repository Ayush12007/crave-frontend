import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { confirmOrder } from '../../features/order/orderSlice';
import { clearCart } from '../../features/cart/cartSlice';
import { Loader, Lock } from 'lucide-react';

const PaymentForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.order);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    // 1. Confirm Payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: 'if_required', // Vital: Stops auto-redirect so we can save order to DB
    });

    if (error) {
        setMessage(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        
        // 2. Payment Success -> Create Order in Backend
        dispatch(confirmOrder({
          paymentIntentId: paymentIntent.id,
          items: cartItems.map(item => ({
            menuItem: item._id,
            quantity: item.qty,
            variant: item.variant || 'Standard',
            priceAtPurchase: item.price // <--- ADD THIS LINE
          }))
        })).then((res) => {
          if (!res.error) {
             dispatch(clearCart());
          }
        });
      }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      {message && <div className="text-red-500 text-sm mt-2">{message}</div>}
      
      <button 
        disabled={loading || !stripe || !elements}
        className="w-full mt-6 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 flex justify-center items-center gap-2"
      >
        {loading ? <Loader className="animate-spin" /> : <><Lock size={16} /> Pay Now</>}
      </button>
    </form>
  );
};

export default PaymentForm;