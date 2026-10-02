  iimport mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interfaces/user.interface";

export interface IUserDocument extends Omit<IUser, "_id">, Document {}

const userSchema: Schema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUserDocument>("User", userSchema);
