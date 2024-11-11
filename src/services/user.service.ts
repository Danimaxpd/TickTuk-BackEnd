import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async createUser(
    userData: Omit<User, 'id' | 'createdAt'>
  ): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    return await this.userRepository.create({
      ...userData,
      createdAt: new Date().toISOString(),
    });
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }

  public async deleteUser(userId: string): Promise<boolean> {
    return await this.userRepository.deleteById(userId);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }
}
