import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product ID'],
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
