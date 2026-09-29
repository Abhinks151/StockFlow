"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const statusCodes_1 = require("../constants/statusCodes");
class UserController {
    userService;
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    register = async (req, res) => {
        try {
            const user = await this.userService.registerUser(req.body);
            res.status(statusCodes_1.HTTP_STATUS.CREATED).json({
                success: true,
                message: statusCodes_1.MESSAGES.USER_CREATED,
                user,
            });
        }
        catch (error) {
            const statusCode = error.statusCode || statusCodes_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
            const message = error.message || statusCodes_1.MESSAGES.SERVER_ERROR;
            res.status(statusCode).json({ success: false, message });
        }
    };
    login = async (req, res) => {
        try {
            const result = await this.userService.loginUser(req.body);
            res.status(statusCodes_1.HTTP_STATUS.OK).json({
                success: true,
                message: statusCodes_1.MESSAGES.LOGIN_SUCCESS,
                token: result.token,
                user: result.user,
            });
        }
        catch (error) {
            const statusCode = error.statusCode || statusCodes_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
            const message = error.message || statusCodes_1.MESSAGES.SERVER_ERROR;
            res.status(statusCode).json({ success: false, message });
        }
    };
    getProfile = async (req, res) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(statusCodes_1.HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: statusCodes_1.MESSAGES.UNAUTHORIZED });
                return;
            }
            const user = await this.userService.getUserProfile(userId);
            res.status(statusCodes_1.HTTP_STATUS.OK).json({
                success: true,
                message: statusCodes_1.MESSAGES.PROFILE_FETCHED,
                user,
            });
        }
        catch (error) {
            const statusCode = error.statusCode || statusCodes_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
            const message = error.message || statusCodes_1.MESSAGES.SERVER_ERROR;
            res.status(statusCode).json({ success: false, message });
        }
    };
    updateProfile = async (req, res) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(statusCodes_1.HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: statusCodes_1.MESSAGES.UNAUTHORIZED });
                return;
            }
            const updatedUser = await this.userService.updateUserProfile(userId, req.body);
            res.status(statusCodes_1.HTTP_STATUS.OK).json({
                success: true,
                message: statusCodes_1.MESSAGES.PROFILE_UPDATED,
                user: updatedUser,
            });
        }
        catch (error) {
            const statusCode = error.statusCode || statusCodes_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
            const message = error.message || statusCodes_1.MESSAGES.SERVER_ERROR;
            res.status(statusCode).json({ success: false, message });
        }
    };
}
exports.UserController = UserController;
