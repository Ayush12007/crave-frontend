import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../features/menu/menuSlice';
import { addToCart } from '../features/cart/cartSlice';
import { Plus, Search, Filter, Sparkles, Loader, X, User, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Rating from '../components/ui/Rating';

const categories = ['All', 'Snacks', 'Soups', 'Main Dish', 'Breads', 'Desserts', 'Drinks'];

const MenuPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.menu);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => { dispatch(fetchMenu()); }, [dispatch]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, qty: 1, variant: 'Standard' }));
  };

  if (loading) return <div className="flex justify-center items-center h-[80vh]"><Loader className="animate-spin text-primary" size={48} /></div>;
  if (error) return <div className="text-center p-20 text-red-500 font-bold text-xl">Error loading menu</div>;

  return (
    <div className="min-h-screen pb-20 pt-24">
      
      {/* --- Hero Section --- */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="relative bg-secondary rounded-[2.5rem] p-10 md:p-16 overflow-hidden shadow-2xl">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary rounded-full blur-[100px] opacity-40"></div>
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-600 rounded-full blur-[100px] opacity-30"></div>

            <div className="relative z-10 max-w-2xl">
                <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
                    Premium Indian Cuisine
                </span>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]">
                    Taste the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-400">Soul</span> of India.
                </h1>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    Experience culinary masterpieces crafted with secret spices and authentic traditions. Delivered hot to your hands.
                </p>

                {/* Modern Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative bg-white rounded-2xl p-2 flex items-center shadow-xl">
                        <div className="p-3 text-gray-400"><Search size={24} /></div>
                        <input 
                            type="text"
                            placeholder="Search for 'Butter Chicken', 'Biryani'..."
                            className="w-full p-2 text-lg outline-none text-gray-800 font-medium placeholder:text-gray-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={20} /></button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- Sticky Categories --- */}
      <div className="sticky top-20 z-40 py-4 bg-cream/80 backdrop-blur-xl border-b border-gray-200/50 mb-10">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 min-w-max">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                            activeCategory === cat 
                            ? 'bg-secondary text-white shadow-lg scale-105' 
                            : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* --- Menu Grid --- */}
      <div className="max-w-7xl mx-auto px-4">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item._id}
                className="group relative bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-soft hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
                onClick={() => setSelectedItem(item)}
              >
                {/* Image */}
                <div className="h-56 relative overflow-hidden">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                        ₹{item.price}
                    </div>
                    {item.rating > 0 && (
                        <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-xs font-bold bg-black/30 backdrop-blur px-2 py-1 rounded-lg border border-white/20">
                            <Star size={12} className="text-yellow-400 fill-yellow-400"/> {item.rating.toFixed(1)}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">
                        {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
                        {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                            {item.category}
                        </span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                            className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary hover:scale-110 active:scale-90 transition-all shadow-lg"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredItems.length === 0 && (
            <div className="text-center py-24 text-gray-400">
                <Filter size={64} className="mx-auto mb-4 opacity-20" />
                <p className="text-xl font-serif">No dishes found matching "{searchQuery}"</p>
            </div>
        )}
      </div>

      {/* --- Enhanced Modal --- */}
      <AnimatePresence>
        {selectedItem && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
                    onClick={() => setSelectedItem(null)}
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 50 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.9, opacity: 0, y: 50 }}
                    className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Close Button */}
                    <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 z-20 bg-white/50 p-2 rounded-full hover:bg-white hover:rotate-90 transition-all duration-300">
                        <X size={24} />
                    </button>

                    {/* Left Image */}
                    <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
                        <img src={selectedItem.image} className="w-full h-full object-cover" alt={selectedItem.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 leading-none">{selectedItem.name}</h2>
                            <div className="flex items-center gap-4 text-lg">
                                <span className="font-bold text-primary text-2xl">₹{selectedItem.price}</span>
                                <span className="w-px h-6 bg-white/30"></span>
                                <span className="flex items-center gap-1 text-yellow-400"><Star fill="currentColor" size={20} /> {selectedItem.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full md:w-1/2 flex flex-col bg-white h-full max-h-[60vh] md:max-h-[auto]">
                        <div className="p-8 border-b border-gray-100">
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">{selectedItem.description}</p>
                            
                            <button 
                                onClick={() => { handleAddToCart(selectedItem); setSelectedItem(null); }}
                                className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-primary hover:shadow-glow hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                            >
                                <Plus size={24} /> Add to Order — ₹{selectedItem.price}
                            </button>
                        </div>

                        {/* Reviews */}
                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                Verified Reviews ({selectedItem.numReviews})
                            </h3>
                            
                            <div className="space-y-4">
                                {selectedItem.reviews?.length > 0 ? selectedItem.reviews.map(review => (
                                    <div key={review._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                                                    <Rating value={review.rating} color="#F59E0B" />
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed pl-[3.25rem]">"{review.comment}"</p>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                                        <p>No reviews yet. Be the first to taste this!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;