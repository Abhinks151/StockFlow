import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import userRoutes from "./routes/user.routes";
import { HTTP_STATUS } from "./constants/statusCodes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Health Check
app.get("/health", (_req, res) => {
  res.status(HTTP_STATUS.OK).send("Ok");
});

// Routes
app.use("/api/users", userRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`User Service running at http://localhost:${PORT}`);
});

export default app;
