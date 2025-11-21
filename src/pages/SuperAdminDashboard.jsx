import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics, fetchUsers, fetchTickets, updateCommission } from '../features/admin/adminSlice';
import { BarChart, Users, DollarSign, Settings, LifeBuoy, Loader, Tag } from 'lucide-react';
import api from '../services/api';

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const { analytics, users, tickets, loading } = useSelector(state => state.admin);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [commRate, setCommRate] = useState(0);
  
  // Coupon Form State
  const [couponForm, setCouponForm] = useState({ 
    code: '', 
    discountType: 'PERCENTAGE', 
    discountAmount: 0, 
    minOrderValue: 0, 
    expirationDate: '', 
    usageLimit: 100 
  });

  useEffect(() => {
    if (activeTab === 'overview') dispatch(fetchAnalytics());
    if (activeTab === 'users') dispatch(fetchUsers());
    if (activeTab === 'support') dispatch(fetchTickets());
  }, [activeTab, dispatch]);

  const handleCommissionUpdate = () => {
    dispatch(updateCommission(commRate));
    alert('Commission Rate Updated!');
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
        await api.post('/coupons', couponForm);
        alert('Coupon Created Successfully!');
        // Reset Form
        setCouponForm({ 
            code: '', 
            discountType: 'PERCENTAGE', 
            discountAmount: 0, 
            minOrderValue: 0, 
            expirationDate: '', 
            usageLimit: 100 
        });
    } catch (err) {
        alert(err.response?.data?.message || 'Error creating coupon');
    }
  };

  // Loading State
  if (loading && !analytics && activeTab === 'overview') {
    return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin text-primary" size={48} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">SuperAdmin Command Center</h1>
        <p className="text-gray-500">Platform oversight and configuration.</p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-8 border-b pb-4 overflow-x-auto">
        {[
          { id: 'overview', icon: BarChart, label: 'Analytics' },
          { id: 'users', icon: Users, label: 'User Base' },
          { id: 'coupons', icon: Tag, label: 'Coupons' },
          { id: 'settings', icon: DollarSign, label: 'Commission' },
          { id: 'support', icon: LifeBuoy, label: 'Support' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === tab.id ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB: OVERVIEW --- */}
      {activeTab === 'overview' && analytics && (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-primary">
              <p className="text-gray-500 text-sm font-bold uppercase">Total Revenue</p>
              <p className="text-4xl font-black mt-2">₹{analytics.totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
              <p className="text-gray-500 text-sm font-bold uppercase">Total Orders</p>
              <p className="text-4xl font-black mt-2">{analytics.totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
              <p className="text-gray-500 text-sm font-bold uppercase">New Users (7d)</p>
              <p className="text-4xl font-black mt-2">{analytics.userGrowth.reduce((acc, cur) => acc + cur.count, 0)}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Top Items */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🏆 Top Selling Items</h3>
              {analytics.topItems.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-dashed border-2">
                  <p className="font-semibold">No sales data yet</p>
                  <p className="text-sm">Wait for the first order!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.topItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600'}`}>#{i+1}</span>
                        <span className="font-semibold text-gray-800">{item.name}</span>
                      </div>
                      <span className="text-primary font-bold">{item.totalSold} sold</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Peak Hours */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">⏰ Peak Hours</h3>
              {analytics.peakHours.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-dashed border-2">
                  <p className="font-semibold">No activity yet</p>
                  <p className="text-sm">Chart will appear after orders</p>
                </div>
              ) : (
                <div className="flex items-end gap-2 h-48 pt-4">
                  {/* Safe sort using spread syntax to prevent state mutation crash */}
                  {[...analytics.peakHours].sort((a,b) => a._id - b._id).map((hour) => (
                    <div key={hour._id} className="flex-1 flex flex-col justify-end group relative">
                      <div 
                        className="bg-primary/20 group-hover:bg-primary transition-all rounded-t-md w-full" 
                        style={{ height: `${(hour.count / analytics.totalOrders) * 100}%`, minHeight: '10%' }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {hour.count} Orders
                        </div>
                      </div>
                      <p className="text-center text-[10px] font-mono text-gray-400 mt-2">{hour._id}:00</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: USERS --- */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-600">Name</th>
                <th className="p-4 font-bold text-gray-600">Email</th>
                <th className="p-4 font-bold text-gray-600">Role</th>
                <th className="p-4 font-bold text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{user.role}</span></td>
                  <td className="p-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TAB: COUPONS --- */}
      {activeTab === 'coupons' && (
        <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">Create New Coupon</h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Code</label>
                        <input required className="border p-2 rounded w-full uppercase" placeholder="WELCOME50" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Type</label>
                        <select className="border p-2 rounded w-full" value={couponForm.discountType} onChange={e => setCouponForm({...couponForm, discountType: e.target.value})}>
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FIXED">Fixed Amount (₹)</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Amount</label>
                        <input type="number" placeholder="e.g. 20" required className="border p-2 rounded w-full" value={couponForm.discountAmount} onChange={e => setCouponForm({...couponForm, discountAmount: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Min Order (₹)</label>
                        <input type="number" placeholder="e.g. 500" required className="border p-2 rounded w-full" value={couponForm.minOrderValue} onChange={e => setCouponForm({...couponForm, minOrderValue: e.target.value})} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Expires On</label>
                        <input type="date" required className="border p-2 rounded w-full" value={couponForm.expirationDate} onChange={e => setCouponForm({...couponForm, expirationDate: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Usage Limit</label>
                        <input type="number" placeholder="e.g. 100" required className="border p-2 rounded w-full" value={couponForm.usageLimit} onChange={e => setCouponForm({...couponForm, usageLimit: e.target.value})} />
                    </div>
                </div>
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold w-full hover:bg-orange-600 transition">Generate Coupon</button>
            </form>
        </div>
      )}

      {/* --- TAB: SETTINGS --- */}
      {activeTab === 'settings' && (
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Platform Commission</h2>
          <p className="text-gray-500 mb-6 text-sm">Set the global percentage taken from order revenue calculations.</p>
          
          <label className="block text-sm font-bold text-gray-700 mb-2">Commission Rate (%)</label>
          <div className="flex gap-4">
            <input 
              type="number" 
              value={commRate}
              onChange={(e) => setCommRate(e.target.value)}
              className="border p-3 rounded-lg w-full font-mono text-lg"
              placeholder="e.g. 10"
            />
            <button 
              onClick={handleCommissionUpdate}
              className="bg-black text-white px-6 rounded-lg font-bold hover:bg-gray-800"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* --- TAB: SUPPORT --- */}
      {activeTab === 'support' && (
        <div className="text-center py-20 text-gray-500">
            <LifeBuoy className="mx-auto mb-4 text-gray-300" size={64} />
            <h3 className="text-xl font-bold">Support Ticket System</h3>
            <p>This module allows viewing and replying to customer issues.</p>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;