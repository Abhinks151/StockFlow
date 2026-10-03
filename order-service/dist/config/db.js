"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/stockflow_orders";
    try {
        await mongoose_1.default.connect(mongoUri);
        console.log("MongoDB connected for Order Service");
    }
    catch (error) {
        console.error("MongoDB connection error in Order Service:", error);
    }
}
