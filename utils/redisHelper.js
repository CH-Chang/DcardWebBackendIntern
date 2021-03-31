const Redis = require("redis");
const AsyncRedis = require("async-redis");

const redisConfig = require("../configs/redisConfig");

const client = Redis.createClient(redisConfig)

const asyncClient = AsyncRedis.decorate(client);

module.exports = asyncClient;