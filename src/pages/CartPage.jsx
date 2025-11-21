import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Trash2, ChevronRight, Sparkles, Tag, X, ShoppingBag } from 'lucide-react';
import { removeFromCart } from '../features/cart/cartSlice';
import { createPaymentIntent, validateCoupon, clearCoupon } from '../features/order/orderSlice';
import { updateCoins } from '../features/auth/authSlice';
import PaymentForm from '../components/ui/PaymentForm';
import api from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { clientSecret, success, currentOrder, coupon, couponError } = useSelector((state) => state.order);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [useCoins, setUseCoins] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [summary, setSummary] = useState({ total: 0, couponDiscount: 0, coinDiscount: 0, final: 0 });

  const rawTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    if(userInfo) {
        api.get('/auth/profile').then(res => dispatch(updateCoins(res.data.coins))).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (success && currentOrder) {
        const coinsEarned = Math.floor(currentOrder.totalAmount / 10);
        const coinsSpent = useCoins ? Math.min(userInfo.coins, (rawTotal - (coupon ? coupon.discount : 0)) * 0.5) : 0;
        const newBalance = (userInfo.coins || 0) - coinsSpent + coinsEarned;
        dispatch(updateCoins(Math.floor(newBalance))); 
        navigate(`/order-success/${currentOrder._id}`);
    }
  }, [success, navigate, currentOrder]);

  useEffect(() => {
    let couponDisc = coupon ? coupon.discount : 0;
    let remainingAfterCoupon = Math.max(0, rawTotal - couponDisc);
    let coinDisc = 0;
    if (useCoins && userInfo) {
        const maxCoinDiscount = remainingAfterCoupon * 0.5;
        coinDisc = Math.min(userInfo.coins, maxCoinDiscount);
    }
    setSummary({
        total: rawTotal,
        couponDiscount: couponDisc,
        coinDiscount: coinDisc,
        final: remainingAfterCoupon - coinDisc
    });
  }, [useCoins, cartItems, userInfo, coupon]);

  const handleApplyCoupon = () => {
    if(!couponInput) return;
    dispatch(validateCoupon({ code: couponInput, cartTotal: rawTotal }));
  };

  const handleRemoveCoupon = () => {
    dispatch(clearCoupon());
    setCouponInput('');
  };

  const handleCheckoutInit = () => {
    if (!userInfo) {
      navigate('/login');
    } else {
      const backendItems = cartItems.map(item => ({ menuItem: item._id, quantity: item.qty, price: item.price }));
      dispatch(createPaymentIntent({ items: backendItems, useCoins, couponCode: coupon ? coupon.code : null }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center pt-20">
        <div className="bg-white p-8 rounded-full mb-6 shadow-soft">
            <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-secondary mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <button onClick={() => navigate('/')} className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-primary transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Start Ordering
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-secondary mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Order Items <span className="text-gray-400 text-sm font-normal">({cartItems.length})</span></h2>
            <div className="space-y-6">
                {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4 group">
                    <div className="h-20 w-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                        {item.image && <img src={item.image} className="h-full w-full object-cover" alt="" />}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800 leading-tight mb-1">{item.name}</h4>
                        <p className="text-gray-500 text-sm">₹{item.price} × {item.qty}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg mb-2">₹{item.price * item.qty}</p>
                        <button onClick={() => dispatch(removeFromCart(item._id))} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
                <h3 className="text-xl font-serif font-bold mb-6">Payment Details</h3>
                
                {/* Promo Code */}
                {!clientSecret && (
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Promo Code</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex-1 outline-none focus:ring-2 focus:ring-primary uppercase font-medium text-sm placeholder-gray-400"
                                placeholder="ENTER CODE"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                                disabled={!!coupon}
                            />
                            {coupon ? (
                                <button onClick={handleRemoveCoupon} className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100 transition"><X size={20}/></button>
                            ) : (
                                <button onClick={handleApplyCoupon} className="bg-black text-white px-5 rounded-xl font-bold hover:bg-gray-800 transition">Apply</button>
                            )}
                        </div>
                        {couponError && <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>}
                        {coupon && <p className="text-green-600 text-xs mt-2 font-bold flex items-center gap-1"><Tag size={12}/> Code {coupon.code} applied!</p>}
                    </div>
                )}

                {/* Loyalty */}
                {userInfo && userInfo.coins > 0 && !clientSecret && (
                    <div className="bg-gradient-to-r from-orange-50 to-cream border border-orange-100 p-4 rounded-2xl mb-8 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-orange-900 flex items-center gap-2 text-sm"><Sparkles size={16} className="text-orange-500"/> Pay with Coins</p>
                            <p className="text-[10px] text-orange-700 font-medium mt-0.5">Balance: {userInfo.coins} (Max 50% off)</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={useCoins} onChange={() => setUseCoins(!useCoins)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                )}

                <div className="space-y-3 mb-8 text-sm font-medium">
                    <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{summary.total.toFixed(2)}</span></div>
                    {summary.couponDiscount > 0 && (
                        <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{summary.couponDiscount.toFixed(2)}</span></div>
                    )}
                    {summary.coinDiscount > 0 && (
                        <div className="flex justify-between text-orange-600"><span>Coins Redeemed</span><span>-₹{summary.coinDiscount.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between text-2xl font-black text-secondary pt-4 border-t border-dashed border-gray-200">
                        <span>Total</span>
                        <span>₹{summary.final.toFixed(2)}</span>
                    </div>
                </div>
                
                {!clientSecret ? (
                <button onClick={handleCheckoutInit} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-primary hover:shadow-lg hover:-translate-y-1 transition-all flex justify-center items-center gap-2">
                    Checkout <ChevronRight size={20} />
                </button>
                ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm clientSecret={clientSecret} />
                </Elements>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;