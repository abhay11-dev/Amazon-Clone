import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productsModel.js';
import { products } from '../products.js';

dotenv.config();

await mongoose.connect('mongodb+srv://abhayrajsinghmandloi_db_user:Zh8JTyBww3ny43ws@cluster0.a3o86x0.mongodb.net/?appName=Cluster0');

const seedData = async () => {
    try {
        await Product.deleteMany();
        const productsWithSlug = products.map((p) => ({
    ...p,
    slug: p.name.toLowerCase().replace(/\s+/g, "-")
}));

await Product.insertMany(productsWithSlug);

        console.log('✅ Products Imported!');
        await mongoose.connection.close();
        process.exit(0);
    } catch(error) {
        console.log(error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedData();