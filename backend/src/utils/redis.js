import { createClient } from "redis";

// Redis connection configuration
const redisConfig = {
  url: `redis://${process.env.REDIS_HOST || "localhost"}:${
    process.env.REDIS_PORT || 6379
  }`,
  password: process.env.REDIS_PASSWORD || undefined, // Optional
  database: process.env.REDIS_DB || 0, // Default DB index
};

// Create and export the Redis client
const redisClient = createClient(redisConfig);

// Log connection events
redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Connect to Redis
redisClient.connect().catch(console.error);

export default redisClient;
