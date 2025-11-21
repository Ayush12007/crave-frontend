import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import menuReducer from '../features/menu/menuSlice'; // <--- Import
import orderReducer from '../features/order/orderSlice';
import adminReducer from '../features/admin/adminSlice'; // <--- Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    menu: menuReducer,
    order: orderReducer,
    admin: adminReducer,
  },
});