"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);
// Protected routes (Token-based auth)
router.get("/profile", auth_middleware_1.authenticateToken, userController.getProfile);
router.patch("/profile", auth_middleware_1.authenticateToken, userController.updateProfile);
router.put("/profile", auth_middleware_1.authenticateToken, userController.updateProfile);
exports.default = router;
