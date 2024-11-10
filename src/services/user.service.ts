import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { DocType } from '../types/model.types';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async createUser(
    userData: Omit<User, 'createdAt'>
  ): Promise<DocType<User>> {   
    return await this.userRepository.create(userData);
  }

  public async getAllUsers(): Promise<DocType<User>[]> {
    return await this.userRepository.getAllUsers();
  }

  public async deleteUser(userId: string): Promise<boolean> {
    return await this.userRepository.delete(userId);
  }

  public async findByEmail(email: string): Promise<DocType<User> | null> {
    return await this.userRepository.findByEmail(email);
  }
}
