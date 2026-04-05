import Redis from "ioredis";

const url = "redis://localhost:6379";
const redis = new Redis(url);

export default redis;
