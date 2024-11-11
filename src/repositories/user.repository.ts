import { BaseRepository } from "./base.repository";
import { User } from "../models/user.model";
import {
  CacheSyncService,
  CacheEventType,
} from "../services/cache-sync.service";

export class UserRepository extends BaseRepository<User> {
  private cacheSync: CacheSyncService;

  constructor() {
    super("user");
    this.cacheSync = CacheSyncService.getInstance();
    this.initializeCacheSync();
  }

  private initializeCacheSync(): void {
    this.cacheSync.subscribe(CacheEventType.USER_DELETED, async (userId) => {
      await super.delete(userId);
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ email });
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.find({});
  }

  public async create(userData: Omit<User, "id">): Promise<User> {
    const user = await super.create(userData);
    await this.cacheSync.publish(CacheEventType.USER_CREATED, user);
    return user;
  }

  public async deleteById(userId: string): Promise<boolean> {
    const success = await super.delete(userId);
    if (success) {
      await this.cacheSync.publish(CacheEventType.USER_DELETED, userId);
    }
    return success;
  }
}
