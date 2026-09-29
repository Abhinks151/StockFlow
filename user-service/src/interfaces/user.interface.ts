import { Request } from "express";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRegisterDTO {
  name: string;
  email: string;
  password?: string;
}

export interface IUserLoginDTO {
  email: string;
  password?: string;
}

export interface IUserUpdateDTO {
  name?: string;
  email?: string;
  password?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
