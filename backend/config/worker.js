const { Worker } = require("bullmq");
const connection = require("../config/redisConnection");

const worker = new Worker(
  "notificationQueue",
  async (job) => {
    const { userId, message, createdAt } = job.data;
    return { userId, message, createdAt };
  },
  { connection }
);

console.log(`Worker is running...`);
