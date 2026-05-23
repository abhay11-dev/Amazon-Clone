import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';

const initialState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await cartAPI.getCart();
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (cartData, { rejectWithValue }) => {
    try {
      const { data } = await cartAPI.addToCart(cartData);
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (cartData, { rejectWithValue }) => {
    try {
      const { data } = await cartAPI.updateCartItem(cartData);
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await cartAPI.removeFromCart(productId);
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart();
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
        state.totalItems = action.payload?.items?.length || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
        state.totalItems = action.payload?.items?.length || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
        state.totalItems = action.payload?.items?.length || 0;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
        state.totalItems = action.payload?.items?.length || 0;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
