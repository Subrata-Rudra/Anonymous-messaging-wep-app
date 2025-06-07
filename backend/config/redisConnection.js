const { Redis } = require("ioredis");

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  maxRetriesPerRequest: null,
});

module.exports = connection;
