import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes (Token-based auth)
router.get("/profile", authenticateToken, userController.getProfile);
router.patch("/profile", authenticateToken, userController.updateProfile);
router.put("/profile", authenticateToken, userController.updateProfile);

export default router;
