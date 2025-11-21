import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLiveQueue, updateOrderStatus } from '../features/order/orderSlice';
import { Loader, ChefHat, Bell, Clock, CheckCircle } from 'lucide-react';

const StaffDashboard = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchLiveQueue());
    const interval = setInterval(() => dispatch(fetchLiveQueue()), 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  if (!userInfo || userInfo.role === 'Customer') return null;

  const isKitchen = ['KitchenManager', 'SuperAdmin'].includes(userInfo.role);
  const isCounter = ['CounterStaff', 'SuperAdmin'].includes(userInfo.role);

  const handleStatus = (id, status) => {
    dispatch(updateOrderStatus({ orderId: id, status }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-24">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isKitchen ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                {isKitchen ? <ChefHat size={28} /> : <Bell size={28} />}
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{isKitchen ? 'Kitchen Display System' : 'Counter Management'}</h1>
                <p className="text-gray-500 text-sm">Live feed • Auto-refreshing every 5s</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Orders</p>
            <p className="text-3xl font-black text-gray-900">{orders.length}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. INCOMING */}
        {isKitchen && (
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="bg-red-50 p-4 rounded-t-2xl border-b border-red-100 flex justify-between items-center">
                <h2 className="font-bold text-red-800 flex items-center gap-2">🔥 Incoming</h2>
                <span className="bg-red-200 text-red-800 px-2 py-1 rounded-lg text-xs font-bold">{orders.filter(o => o.status === 'Paid').length}</span>
            </div>
            <div className="bg-gray-50 flex-1 overflow-y-auto p-4 space-y-4 rounded-b-2xl border border-gray-200">
              {orders.filter(o => o.status === 'Paid').map(order => (
                <OrderCard key={order._id} order={order} btnLabel="Start Cooking" btnColor="bg-black hover:bg-gray-800" onClick={() => handleStatus(order._id, 'Preparing')} />
              ))}
            </div>
          </div>
        )}

        {/* 2. COOKING */}
        {isKitchen && (
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="bg-yellow-50 p-4 rounded-t-2xl border-b border-yellow-100 flex justify-between items-center">
                <h2 className="font-bold text-yellow-800 flex items-center gap-2">👨‍🍳 Cooking</h2>
                <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-lg text-xs font-bold">{orders.filter(o => o.status === 'Preparing').length}</span>
            </div>
            <div className="bg-gray-50 flex-1 overflow-y-auto p-4 space-y-4 rounded-b-2xl border border-gray-200">
              {orders.filter(o => o.status === 'Preparing').map(order => (
                <OrderCard key={order._id} order={order} btnLabel="Mark Ready" btnColor="bg-yellow-500 hover:bg-yellow-600" onClick={() => handleStatus(order._id, 'Ready')} />
              ))}
            </div>
          </div>
        )}

        {/* 3. READY */}
        {(isCounter || isKitchen) && (
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="bg-green-50 p-4 rounded-t-2xl border-b border-green-100 flex justify-between items-center">
                <h2 className="font-bold text-green-800 flex items-center gap-2">✅ Ready for Pickup</h2>
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded-lg text-xs font-bold">{orders.filter(o => o.status === 'Ready').length}</span>
            </div>
            <div className="bg-gray-50 flex-1 overflow-y-auto p-4 space-y-4 rounded-b-2xl border border-gray-200">
              {orders.filter(o => o.status === 'Ready').map(order => (
                <div key={order._id} className="bg-white p-5 rounded-xl shadow-sm border border-green-100">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                        <span className="text-2xl font-black text-gray-900">#{order.orderNumber}</span>
                        <p className="text-sm text-gray-500 font-medium">{order.customer?.name}</p>
                     </div>
                     <div className="bg-green-100 p-2 rounded-full"><CheckCircle size={20} className="text-green-600"/></div>
                   </div>
                   {isCounter && (
                     <button onClick={() => handleStatus(order._id, 'Picked_Up')} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 shadow-sm">
                       Complete Order
                     </button>
                   )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderCard = ({ order, btnLabel, btnColor, onClick }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
      <span className="text-xl font-black text-gray-800">#{order.orderNumber}</span>
      <span className="text-xs font-bold text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
        <Clock size={12}/> {new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
      </span>
    </div>
    <ul className="space-y-2 mb-5">
      {order.items.map((item, i) => (
        <li key={i} className="text-sm text-gray-700 font-medium flex justify-between">
            <span>{item.quantity}x {item.menuItem?.name}</span>
        </li>
      ))}
    </ul>
    <button onClick={onClick} className={`w-full ${btnColor} text-white py-3 rounded-lg font-bold transition-colors shadow-sm`}>
      {btnLabel}
    </button>
  </div>
);

export default StaffDashboard;