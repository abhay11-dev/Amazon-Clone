import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
    },
    category:{
   type:String
    },
    image: {
      type: String,
      required: [true, 'Please provide a product image'],
    },
    images: [
      {
        type: String,
      },
    ],
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numRev: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ rating: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
