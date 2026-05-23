import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../services/api';

const initialState = {
  items: [],
  total: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  selectedProduct: null,
  filters: {
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: Infinity,
    rating: 0,
    sortBy: '-createdAt',
  },
};

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.getAllProducts(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.getProductById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.searchProducts(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const filterProducts = createAsyncThunk(
  'product/filterProducts',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.filterProducts(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch product';
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Search failed';
      })
      .addCase(filterProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(filterProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Filter failed';
      });
  },
});

export const { setFilters, setCurrentPage, clearError, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
