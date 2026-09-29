"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("../models/user.model");
class UserRepository {
    async create(userData) {
        return await user_model_1.User.create(userData);
    }
    async findByEmail(email) {
        return await user_model_1.User.findOne({ email: email.toLowerCase() });
    }
    async findById(id) {
        return await user_model_1.User.findById(id);
    }
    async updateById(id, updateData) {
        return await user_model_1.User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }
}
exports.UserRepository = UserRepository;
