import { BaseRepository } from './base.repository';
import { User } from '../models/user.model';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('user');
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ email });
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.find({});
  }

  public async create(userData: Omit<User, 'id'>): Promise<User> {
    return await super.create(userData);
  }

  public async deleteById(userId: string): Promise<boolean> {
    return await super.delete(userId);
  }
}
