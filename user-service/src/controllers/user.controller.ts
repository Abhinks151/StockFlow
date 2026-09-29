import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../interfaces/user.interface";
import { HTTP_STATUS } from "../constants/statusCodes";
import { MESSAGES } from "../constants/messages";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.registerUser(req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.USER_CREATED,
        user,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || MESSAGES.SERVER_ERROR;
      res.status(statusCode).json({ success: false, message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.userService.loginUser(req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.LOGIN_SUCCESS,
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || MESSAGES.SERVER_ERROR;
      res.status(statusCode).json({ success: false, message });
    }
  };

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.UNAUTHORIZED });
        return;
      }

      const user = await this.userService.getUserProfile(userId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.PROFILE_FETCHED,
        user,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || MESSAGES.SERVER_ERROR;
      res.status(statusCode).json({ success: false, message });
    }
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.UNAUTHORIZED });
        return;
      }

      const updatedUser = await this.userService.updateUserProfile(userId, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.PROFILE_UPDATED,
        user: updatedUser,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
      const message = error.message || MESSAGES.SERVER_ERROR;
      res.status(statusCode).json({ success: false, message });
    }
  };
}
