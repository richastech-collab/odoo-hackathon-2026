import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/odoo_hackathon');
    console.log(`🍃 Database active: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection failed: ${error}`);
    process.exit(1);
  }
};