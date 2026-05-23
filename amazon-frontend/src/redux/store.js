import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['cart/fetchCart/fulfilled'],
        ignoredPaths: ['cart.items'],
      },
    }),
});

export default store;
