"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const messages_1 = require("../constants/messages");
const statusCodes_1 = require("../constants/statusCodes");
class UserService {
    userRepository;
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    sanitizeUser(user) {
        const obj = user.toObject ? user.toObject() : user;
        const { password, __v, ...sanitized } = obj;
        return sanitized;
    }
    async registerUser(dto) {
        const { name, email, password } = dto;
        if (!name || !email || !password) {
            throw { statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST, message: messages_1.MESSAGES.MISSING_FIELDS };
        }
        if (!this.isValidEmail(email)) {
            throw { statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST, message: messages_1.MESSAGES.INVALID_EMAIL_FORMAT };
        }
        if (password.length < 6) {
            throw { statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST, message: messages_1.MESSAGES.PASSWORD_TOO_SHORT };
        }
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw { statusCode: statusCodes_1.HTTP_STATUS.CONFLICT, message: messages_1.MESSAGES.EMAIL_EXISTS };
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
        });
        return this.sanitizeUser(newUser);
    }
    async loginUser(dto) {
        const { email, password } = dto;
        if (!email || !password) {
            throw { statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST, message: messages_1.MESSAGES.MISSING_FIELDS };
        }
        if (!this.isValidEmail(email)) {
            throw { statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST, message: messages_1.MESSAGES.INVALID_EMAIL_FORMAT };
        }
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.password) {
            throw { statusCode: statusCodes_1.HTTP_STATUS.UNAUTHORIZED, message: messages_1.MESSAGES.INVALID_CREDENTIALS };
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw { statusCode: statusCodes_1.HTTP_STATUS.UNAUTHORIZED, message: messages_1.MESSAGES.INVALID_CREDENTIALS };
        }
        const secret = process.env.JWT_SECRET || "default_secret";
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email }, secret, { expiresIn: "1d" });
        return {
            token,
            user: this.sanitizeUser(user),
        };
    }
    async getUserProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw { statusCode: statusCodes_1.HTTP_STATUS.NOT_FOUND, message: messages_1.MESSAGES.USER_NOT_FOUND };
        }
        return this.sanitizeUser(user);
    }
    async updateUserProfile(userId, dto) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw { statusCode: statusCodes_1.HTTP_STATUS.NOT_FOUND, message: messages_1.MESSAGES.USER_NOT_FOUND };
        }
        const updateData = {};
        if (dto.name !== undefined) {
            if (!dto.name.trim()) {
                throw { statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST, message: messages_1.MESSAGES.NAME_EMPTY };
            }
            updateData.name = dto.name.trim();
        }
        if (dto.email !== undefined && dto.email.toLowerCase() !== user.email.toLowerCase()) {
            if (!this.isValidEmail(dto.email)) {
                throw { statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST, message: messages_1.MESSAGES.INVALID_EMAIL_FORMAT };
            }
            const existingUser = await this.userRepository.findByEmail(dto.email);
            if (existingUser) {
                throw { statusCode: statusCodes_1.HTTP_STATUS.CONFLICT, message: messages_1.MESSAGES.EMAIL_EXISTS };
            }
            updateData.email = dto.email.toLowerCase();
        }
        if (dto.password !== undefined && dto.password.trim() !== "") {
            if (dto.password.length < 6) {
                throw { statusCode: statusCodes_1.HTTP_STATUS.BAD_REQUEST, message: messages_1.MESSAGES.PASSWORD_TOO_SHORT };
            }
            updateData.password = await bcryptjs_1.default.hash(dto.password, 10);
        }
        const updatedUser = await this.userRepository.updateById(userId, updateData);
        if (!updatedUser) {
            throw { statusCode: statusCodes_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message: messages_1.MESSAGES.PROFILE_UPDATE_FAILED };
        }
        return this.sanitizeUser(updatedUser);
    }
}
exports.UserService = UserService;
