import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addMenuItem } from '../features/menu/menuSlice';
import { PlusCircle, Loader, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const AdminAddMenu = () => {
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Burgers', image: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.menu);
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo || userInfo.role !== 'SuperAdmin') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addMenuItem({ ...form, price: Number(form.price) }));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-black flex items-center gap-2 mb-6 font-bold">
            <ArrowLeft size={20}/> Back to Menu
        </button>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
            <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Add New Dish</h2>
                <p className="text-gray-500">Expand the menu with a new culinary delight.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Item Name</label>
                    <input required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium" placeholder="e.g. Truffle Burger" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                    <textarea required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium resize-none h-32" placeholder="Describe the taste..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price (₹)</label>
                        <input type="number" required className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-bold text-lg" placeholder="350" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                        <select className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                            {['Snacks', 'Soups', 'Main Dish', 'Breads', 'Desserts', 'Drinks'].map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL</label>
                    <div className="relative">
                        <ImageIcon className="absolute left-4 top-4 text-gray-400" size={20}/>
                        <input required placeholder="https://images.unsplash.com/..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-sm" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
                    </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-primary shadow-lg transition-all flex items-center justify-center gap-2 mt-4">
                    {loading ? <Loader className="animate-spin" /> : <>Add to Menu <PlusCircle size={20} /></>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddMenu;