const redisClient = require("redis");

const REDIS_ENDPOINT = process.env.REDIS_ENDPOINT ? `//${process.env.REDIS_ENDPOINT}` : undefined;
console.log(`Redis Endpoint: ${REDIS_ENDPOINT}`);
const redis = redisClient.createClient(REDIS_ENDPOINT);
redis.on("error", (err) => {
    console.error(err);
});

module.exports = redis;
