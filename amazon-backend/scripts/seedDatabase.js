import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productsModel.js';
import { products } from '../products.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URL);

const seedData = async () => {
    try {
        await Product.deleteMany();
        const productsWithSlug = products.map((p) => ({
    ...p,
    slug: p.name.toLowerCase().replace(/\s+/g, "-")
}));

await Product.insertMany(productsWithSlug);

        console.log('Products Imported!');
        process.exit(0);
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
};

seedData();