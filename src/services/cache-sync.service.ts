import { subscriber, publisher } from "../config/redis";

export enum CacheEventType {
  USER_CREATED = "USER_CREATED",
  USER_DELETED = "USER_DELETED",
}

interface CacheEvent {
  type: CacheEventType;
  data: any;
}

export class CacheSyncService {
  private static instance: CacheSyncService;
  private eventHandlers: Map<CacheEventType, ((data: any) => void)[]>;

  private constructor() {
    this.eventHandlers = new Map();
    this.initializeSubscriber();
  }

  public static getInstance(): CacheSyncService {
    if (!CacheSyncService.instance) {
      CacheSyncService.instance = new CacheSyncService();
    }
    return CacheSyncService.instance;
  }

  private initializeSubscriber(): void {
    subscriber.subscribe("cache-sync", (err) => {
      if (err) {
        console.error("Failed to subscribe:", err);
        return;
      }
    });

    subscriber.on("message", (_channel, message) => {
      try {
        const event: CacheEvent = JSON.parse(message);
        this.notifyHandlers(event.type, event.data);
      } catch (err) {
        console.error("Error processing cache sync message:", err);
      }
    });
  }

  public async publish(type: CacheEventType, data: any): Promise<void> {
    const event: CacheEvent = { type, data };
    await publisher.publish("cache-sync", JSON.stringify(event));
  }

  public subscribe(type: CacheEventType, handler: (data: any) => void): void {
    const handlers = this.eventHandlers.get(type) || [];
    handlers.push(handler);
    this.eventHandlers.set(type, handlers);
  }

  private notifyHandlers(type: CacheEventType, data: any): void {
    const handlers = this.eventHandlers.get(type) || [];
    handlers.forEach((handler) => handler(data));
  }
}
