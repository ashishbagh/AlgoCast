import { consumer } from "./util/kafka.js";

const start = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "send-email",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ key, message }) => {
      const payload = JSON.parse(message.value.toString());
      console.log(key, payload);
    },
  });
};

start().catch((error) => console.log(error));
