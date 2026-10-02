import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();
const productController = new ProductController();

router.post("/", productController.create);
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.put("/:id", productController.update);
router.patch("/:id", productController.update);
router.patch("/:id/stock", productController.updateStock);

export default router;
