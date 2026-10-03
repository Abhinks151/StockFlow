"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const order_model_1 = require("../models/order.model");
class OrderRepository {
    async create(data) {
        return await order_model_1.OrderModel.create(data);
    }
    async findById(id) {
        return await order_model_1.OrderModel.findById(id);
    }
    async findByUserId(userId) {
        return await order_model_1.OrderModel.find({ userId }).sort({ createdAt: -1 });
    }
    async findAll() {
        return await order_model_1.OrderModel.find().sort({ createdAt: -1 });
    }
    async updateStatus(id, status) {
        return await order_model_1.OrderModel.findByIdAndUpdate(id, { status }, { new: true });
    }
}
exports.OrderRepository = OrderRepository;
