import { redis } from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseRepository<T> {
  constructor(private readonly prefix: string) {}

  protected async create(data: Omit<T, 'id'>): Promise<T> {
    const id = uuidv4();
    const item = { id, ...data, createdAt: new Date().toISOString() };
    await redis.set(`${this.prefix}:${id}`, JSON.stringify(item));
    return item as T;
  }

  protected async findOne(query: Partial<T>): Promise<T | null> {
    const keys = await redis.keys(`${this.prefix}:*`);
    for (const key of keys) {
      const itemStr = await redis.get(key);
      if (!itemStr) continue;
      const item = JSON.parse(itemStr) as T;
      if (this.matchesQuery(item, query)) {
        return item;
      }
    }
    return null;
  }

  protected async find(query: Partial<T>): Promise<T[]> {
    const keys = await redis.keys(`${this.prefix}:*`);
    const items: T[] = [];
    for (const key of keys) {
      const itemStr = await redis.get(key);
      if (!itemStr) continue;
      const item = JSON.parse(itemStr) as T;
      if (this.matchesQuery(item, query)) {
        items.push(item);
      }
    }
    return items;
  }

  protected async delete(id: string): Promise<boolean> {
    const result = await redis.del(`${this.prefix}:${id}`);
    return result === 1;
  }

  private matchesQuery(item: T, query: Partial<T>): boolean {
    return Object.entries(query).every(
      ([key, value]) => item[key as keyof T] === value
    );
  }
}
