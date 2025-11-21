import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderDetails } from '../features/order/orderSlice';
import { CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const { currentOrder, loading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentOrder) dispatch(fetchOrderDetails(id));
  }, [dispatch, id, currentOrder]);

  if (loading || !currentOrder) return null;

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative"
      >
        {/* Receipt Top */}
        <div className="bg-primary p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-white text-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
                <CheckCircle size={40} strokeWidth={3} />
            </motion.div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-orange-100">Preparing your food now.</p>
        </div>

        {/* Ticket Info */}
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div className="text-center flex-1 border-r border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-2xl font-black text-secondary">{currentOrder.orderNumber}</p>
                </div>
                <div className="text-center flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Pickup</p>
                    <p className="text-2xl font-black text-primary">
                        {new Date(currentOrder.estimatedPickupTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl mb-8 flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm"><MapPin size={20} className="text-red-500"/></div>
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Pickup Location</p>
                    <p className="font-bold text-gray-800 text-sm">Crave Counter, 123 Food St, Bhopal</p>
                </div>
            </div>

            <Link to="/" className="block w-full bg-black text-white py-4 rounded-xl font-bold text-center hover:bg-gray-900 transition-all flex items-center justify-center gap-2">
                Back to Menu <ArrowRight size={18}/>
            </Link>
        </div>

        {/* Jagged Edge Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-secondary" style={{ clipPath: "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)" }}></div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;