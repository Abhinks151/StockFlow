import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import { User } from "./models/user.models";
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

connectDB();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).send("Ok");
});

app.post("/user/create", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });

  return res.status(201).json({ message: "User created successfully", user });
});

app.listen(PORT, () => {
  console.log(`User Service running at http://localhost:${PORT}`);
});


// curl -X POST http://localhost:3000/user/create \
//   -H "Content-Type: application/json" \
//   -d '{
//     "name": "John Doe",
//     "email": "john@example.com",
//     "password": "secret123"
//   }'