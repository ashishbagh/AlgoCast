let queue = [1, 2, 3, 4, 5];

const sendCall = (queue) => {
  const Q1 = taskSchedule(queue.pop()).then((res) => {
    console.log(res);
    return queueRest(queue);
  });
  const Q2 = taskSchedule(queue.pop()).then((res) => {
    console.log(res);
    return queueRest(queue);
  });

  Promise.allSettled([Q1, Q2]).then((response) => {
    console.log(response, "All settled");
  });
};

const queueRest = async (queue) => {
  if (queue.length === 0) {
    return;
  }
  const response = await taskSchedule(queue.pop());
  console.log(response);
  return queueRest(queue);
};

const taskSchedule = async (id) => {
  console.log(`${id}` + "queued");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`${id}` + "- executed successfully");
    }, id * 1000);
  });
};

sendCall([1, 2, 3, 4, 5]);
