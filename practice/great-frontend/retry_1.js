function fetchDataWithRetry(fn, retryCount) {
  const retryFunction = async () => {
    try {
      const response = await fn();
      return response;
    } catch (error) {
      retryCount--;
      if (retryCount > 0) return retryFunction();
      throw error;
    }
  };

  return retryFunction;
}

const fetchFeedData = (n) => {
  console.log("Fetching feed");
  return new Promise((res, reject) => setTimeout(() => reject(n), 500));
};

const fetchFeedDataWithRetry = fetchDataWithRetry(fetchFeedData, 4);

fetchFeedDataWithRetry(5)
  .then(() => {
    console.log("Success");
  })
  .catch(() => {
    console.log("Error after retries");
  });
