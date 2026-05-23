import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistAPI } from '../../services/api';

const initialState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await wishlistAPI.getWishlist();
      return data.wishlist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await wishlistAPI.addToWishlist({ productId });
      return data.wishlist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.totalItems = action.payload?.length || 0;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.totalItems += 1;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product._id !== action.payload);
        state.totalItems -= 1;
      });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
