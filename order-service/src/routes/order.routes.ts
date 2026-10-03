import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();
const orderController = new OrderController();

router.post("/", orderController.create);
router.get("/", orderController.getUserOrders);
router.get("/:id", orderController.getById);

export default router;
