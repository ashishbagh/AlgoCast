import redis from "../util/redis.js";
import { producer } from "../util/kafka.js";

const getAllData = async () => {
  try {
    const keys = await redis.keys("*");
    const result = {};
    for (const key of keys) {
      result[key] = await redis.lrange(key, 0, -1);
    }
    return result;
  } catch (error) {
    return error;
  }
};

const getPosts = (request, response, next) => {
  getAllData().then((data) => response.status(200).json(data));
};

const createposts = (request, response, next) => {
  const { title, content, id } = request.body;
  redis.rpush(id, JSON.stringify({ id, title, content })).then((data) =>
    response.status(201).json({
      message: `Post Created Successfully ${data}`,
      post: { id, title, content },
    }),
  );
};

const sendEmail = async (request, response, next) => {
  await producer.connect();
  await producer.send({
    topic: "send-email",
    messages: [
      { key: "7", value: JSON.stringify({ message: "Yes got the message1" }) },
      { key: "8", value: JSON.stringify({ message: "Yes got the message 3" }) },
      { key: "6", value: JSON.stringify({ message: "Yes got the message 5" }) },
    ],
  });

  response.status(202).json({
    message: "Email queued in Kafka",
  });
};

export default { getPosts, createposts, sendEmail };
