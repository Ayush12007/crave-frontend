import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderPage from './pages/OrderPage'; // <--- Import this
import StaffDashboard from './pages/StaffDashboard'; // <--- Import
import AdminAddMenu from './pages/AdminAddMenu';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrderPage />} /> {/* <--- Add this Route */}
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />
            <Route path="/dashboard" element={<StaffDashboard />} />
            <Route path="/admin/add-item" element={<AdminAddMenu />} />
            <Route path="/superadmin" element={<SuperAdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;