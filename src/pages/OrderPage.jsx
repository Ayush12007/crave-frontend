import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/order/orderSlice';
import { createReview, fetchMenu } from '../features/menu/menuSlice';
import { Loader, ShoppingBag, Clock, Star, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  
  const [reviewModal, setReviewModal] = useState({ show: false, itemId: null, itemName: '' });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleOpenReview = (itemId, itemName) => {
    setReviewModal({ show: true, itemId, itemName });
    setRating(5);
    setComment('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    await dispatch(createReview({ id: reviewModal.itemId, rating, comment }));
    setReviewModal({ show: false, itemId: null, itemName: '' });
    dispatch(fetchMenu()); // Refresh menu to update star counts
    alert('Review Submitted!');
  };

  const getStatusColor = (status) => {
      switch (status) {
        case 'Paid': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Preparing': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'Ready': return 'bg-green-100 text-green-700 border-green-200';
        case 'Picked_Up': return 'bg-gray-100 text-gray-600 border-gray-200';
        default: return 'bg-gray-100 text-gray-600';
      }
  };

  if (loading) return <div className="flex justify-center items-center h-[60vh]"><Loader className="animate-spin text-primary" size={40} /></div>;
  
  return (
    <div className="min-h-screen pt-24 pb-10 px-4 max-w-4xl mx-auto">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-serif font-bold text-secondary mb-2">Your Orders</h1>
        <p className="text-gray-500">Track your past meals and reorder your favorites.</p>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
          <p className="text-gray-500">Your delicious journey begins with the first bite.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order._id} 
                className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-bold text-secondary">#{order.orderNumber}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                     <Clock size={12}/> {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total Paid</p>
                   <p className="text-2xl font-black text-primary">₹{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                            {item.menuItem?.image ? (
                                <img src={item.menuItem.image} className="w-full h-full object-cover rounded-xl" alt="" />
                            ) : <Package size={20}/>}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 leading-tight">
                                {item.quantity}x {item.menuItem?.name || 'Item Unavailable'}
                            </p>
                            {item.variant !== 'Standard' && <p className="text-xs text-gray-500">{item.variant}</p>}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-600 hidden md:block">₹{(item.priceAtPurchase || 0).toFixed(2)}</span>
                        {item.menuItem && (
                            <button 
                                onClick={() => handleOpenReview(item.menuItem._id, item.menuItem.name)}
                                className="text-xs font-bold text-yellow-600 hover:text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                            >
                                <Star size={12} fill="currentColor" /> Rate
                            </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Info (Estimated Time) */}
              {order.status !== 'Picked_Up' && order.estimatedPickupTime && (
                  <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3 text-blue-800 text-sm font-medium">
                      <Clock size={18} />
                      <span>Estimated Pickup: <strong>{new Date(order.estimatedPickupTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong></span>
                  </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal.show && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                    onClick={() => setReviewModal({show: false})} 
                />
                
                {/* Modal Card */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.95, opacity: 0 }} 
                    className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative z-10"
                >
                    <button onClick={() => setReviewModal({show: false})} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                        <X/>
                    </button>
                    
                    <h2 className="text-2xl font-serif font-bold mb-2">Rate Item</h2>
                    <p className="text-gray-500 mb-8">How was the <span className="text-primary font-bold">{reviewModal.itemName}</span>?</p>

                    <form onSubmit={handleSubmitReview}>
                        <div className="flex justify-center gap-3 mb-8">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button 
                                    type="button"
                                    key={num} 
                                    onClick={() => setRating(num)}
                                    className={`p-2 transition-all hover:scale-110 ${rating >= num ? 'text-yellow-400' : 'text-gray-200'}`}
                                >
                                    <Star size={36} fill="currentColor" />
                                </button>
                            ))}
                        </div>

                        <textarea 
                            required
                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl mb-6 focus:ring-2 focus:ring-primary focus:bg-white outline-none resize-none text-sm"
                            placeholder="Tell us what you liked..."
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>

                        <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-primary transition-colors shadow-lg">
                            Submit Review
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;