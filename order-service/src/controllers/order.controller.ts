import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { HTTP_STATUS, MESSAGES } from "../constants/statusCodes";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const headerUserId = req.headers["x-user-id"];
      const userId =
        (Array.isArray(headerUserId) ? headerUserId[0] : headerUserId) ||
        (req.body.userId as string);
      const { productId, quantity } = req.body;

      const order = await this.orderService.createOrder({
        userId,
        productId,
        quantity,
      });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.ORDER_CREATED,
        order,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || MESSAGES.SERVER_ERROR;
      res.status(statusCode).json({ success: false, message });
    }
  };

  getUserOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const headerUserId = req.headers["x-user-id"];
      const userId =
        (Array.isArray(headerUserId) ? headerUserId[0] : headerUserId) ||
        (req.params.userId as string);
      const orders = await this.orderService.getOrdersByUser(userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.ORDERS_FETCHED,
        orders,
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
      const order = await this.orderService.getOrderById(id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.ORDER_FETCHED,
        order,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || MESSAGES.SERVER_ERROR;
      res.status(statusCode).json({ success: false, message });
    }
  };
}
