import { User, IUserDocument } from "../models/user.model";
import { IUserRegisterDTO, IUserUpdateDTO } from "../interfaces/user.interface";

export class UserRepository {
  async create(userData: IUserRegisterDTO): Promise<IUserDocument> {
    return await User.create(userData);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return await User.findById(id);
  }

  async updateById(id: string, updateData: IUserUpdateDTO): Promise<IUserDocument | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
}
