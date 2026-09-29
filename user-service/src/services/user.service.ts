import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { IUserRegisterDTO, IUserLoginDTO, IUserUpdateDTO, IUser } from "../interfaces/user.interface";
import { MESSAGES } from "../constants/messages";
import { HTTP_STATUS } from "../constants/statusCodes";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private sanitizeUser(user: any): Partial<IUser> {
    const obj = user.toObject ? user.toObject() : user;
    const { password, __v, ...sanitized } = obj;
    return sanitized;
  }

  async registerUser(dto: IUserRegisterDTO) {
    const { name, email, password } = dto;

    if (!name || !email || !password) {
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.MISSING_FIELDS };
    }

    if (!this.isValidEmail(email)) {
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.INVALID_EMAIL_FORMAT };
    }

    if (password.length < 6) {
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.PASSWORD_TOO_SHORT };
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw { statusCode: HTTP_STATUS.CONFLICT, message: MESSAGES.EMAIL_EXISTS };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.sanitizeUser(newUser);
  }

  async loginUser(dto: IUserLoginDTO) {
    const { email, password } = dto;

    if (!email || !password) {
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.MISSING_FIELDS };
    }

    if (!this.isValidEmail(email)) {
      throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.INVALID_EMAIL_FORMAT };
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password) {
      throw { statusCode: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.INVALID_CREDENTIALS };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { statusCode: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.INVALID_CREDENTIALS };
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw { statusCode: HTTP_STATUS.NOT_FOUND, message: MESSAGES.USER_NOT_FOUND };
    }

    return this.sanitizeUser(user);
  }

  async updateUserProfile(userId: string, dto: IUserUpdateDTO) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw { statusCode: HTTP_STATUS.NOT_FOUND, message: MESSAGES.USER_NOT_FOUND };
    }

    const updateData: IUserUpdateDTO = {};

    if (dto.name !== undefined) {
      if (!dto.name.trim()) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.NAME_EMPTY };
      }
      updateData.name = dto.name.trim();
    }

    if (dto.email !== undefined && dto.email.toLowerCase() !== user.email.toLowerCase()) {
      if (!this.isValidEmail(dto.email)) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.INVALID_EMAIL_FORMAT };
      }
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw { statusCode: HTTP_STATUS.CONFLICT, message: MESSAGES.EMAIL_EXISTS };
      }
      updateData.email = dto.email.toLowerCase();
    }

    if (dto.password !== undefined && dto.password.trim() !== "") {
      if (dto.password.length < 6) {
        throw { statusCode: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.PASSWORD_TOO_SHORT };
      }
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.userRepository.updateById(userId, updateData);
    if (!updatedUser) {
      throw { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: MESSAGES.PROFILE_UPDATE_FAILED };
    }

    return this.sanitizeUser(updatedUser);
  }
}
