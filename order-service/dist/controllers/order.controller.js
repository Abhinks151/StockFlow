"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const statusCodes_1 = require("../constants/statusCodes");
class OrderController {
    orderService;
    constructor() {
        this.orderService = new order_service_1.OrderService();
    }
    create = async (req, res) => {
        try {
            const headerUserId = req.headers["x-user-id"];
            const userId = (Array.isArray(headerUserId) ? headerUserId[0] : headerUserId) ||
                req.body.userId;
            const { productId, quantity } = req.body;
            const order = await this.orderService.createOrder({
                userId,
                productId,
                quantity,
            });
            res.status(statusCodes_1.HTTP_STATUS.CREATED).json({
                success: true,
                message: statusCodes_1.MESSAGES.ORDER_CREATED,
                order,
            });
        }
        catch (error) {
            const statusCode = error.statusCode || statusCodes_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
            const message = error.message || statusCodes_1.MESSAGES.SERVER_ERROR;
            res.status(statusCode).json({ success: false, message });
        }
    };
    getUserOrders = async (req, res) => {
        try {
            const headerUserId = req.headers["x-user-id"];
            const userId = (Array.isArray(headerUserId) ? headerUserId[0] : headerUserId) ||
                req.params.userId;
            const orders = await this.orderService.getOrdersByUser(userId);
            res.status(statusCodes_1.HTTP_STATUS.OK).json({
                success: true,
                message: statusCodes_1.MESSAGES.ORDERS_FETCHED,
                orders,
            });
        }
        catch (error) {
            const statusCode = error.statusCode || statusCodes_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
            const message = error.message || statusCodes_1.MESSAGES.SERVER_ERROR;
            res.status(statusCode).json({ success: false, message });
        }
    };
    getById = async (req, res) => {
        try {
            const id = req.params.id;
            const order = await this.orderService.getOrderById(id);
            res.status(statusCodes_1.HTTP_STATUS.OK).json({
                success: true,
                message: statusCodes_1.MESSAGES.ORDER_FETCHED,
                order,
            });
        }
        catch (error) {
            const statusCode = error.statusCode || statusCodes_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
            const message = error.message || statusCodes_1.MESSAGES.SERVER_ERROR;
            res.status(statusCode).json({ success: false, message });
        }
    };
}
exports.OrderController = OrderController;
