const { Queue } = require("bullmq");
const connection = require("./redisConnection");

const notificationQueue = new Queue("notificationQueue", { connection });

module.exports = notificationQueue;
