import { BaseRepository } from "./base.repository";
import { User, UserModel } from "../models/user.model";
import { DocType } from '../types/model.types';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(UserModel);
  }

  public async findByEmail(email: string): Promise<DocType<User> | null> {
    return await this.findOne({ email });
  }

  public async getAllUsers(): Promise<DocType<User>[]> {
    return await this.find({});
  }
}
