import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

console.debug("Connecting to Redis at:", process.env.REDIS_URL);

export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number): number | null {
    if (times > 3) {
      console.error("Could not connect to Redis, giving up");
      return null;
    }
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  enableReadyCheck: false,
  lazyConnect: true,
});

export const subscriber = new Redis(process.env.REDIS_URL);

export const publisher = new Redis(process.env.REDIS_URL);

redis.on("error", (err: Error) => {
  console.error("Redis Client Error:", err.message);
});

redis.on("connect", () => {
  console.log("Redis Client Connected");
});

redis.on("reconnecting", () => {
  console.log("Redis Client Reconnecting");
});

process.on("SIGTERM", () => {
  redis.disconnect();
  subscriber.disconnect();
  publisher.disconnect();
});
