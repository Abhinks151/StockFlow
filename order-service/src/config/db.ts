import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://mongo:27017/stockflow_orders";
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected for Order Service");
  } catch (error) {
    console.error("MongoDB connection error in Order Service:", error);
  }
}
