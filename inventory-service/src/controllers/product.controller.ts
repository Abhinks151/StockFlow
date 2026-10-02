import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { HTTP_STATUS, MESSAGES } from "../constants/statusCodes";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.PRODUCT_CREATED,
        product,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || MESSAGES.SERVER_ERROR;
      res.status(statusCode).json({ success: false, message });
    }
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.PRODUCTS_FETCHED,
        products,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || MESSAGES.SERVER_ERROR;
      res.status(statusCode).json({ success: false, message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const product = await this.productService.getProductById(id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.PRODUCT_FETCHED,
        product,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || MESSAGES.SERVER_ERROR;
      res.status(statusCode).json({ success: false, message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const product = await this.productService.updateProduct(id, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.PRODUCT_UPDATED,
        product,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || MESSAGES.SERVER_ERROR;
      res.status(statusCode).json({ success: false, message });
    }
  };

  updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const product = await this.productService.updateStock(id, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.STOCK_UPDATED,
        product,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || MESSAGES.SERVER_ERROR;
      res.status(statusCode).json({ success: false, message });
    }
  };
}
