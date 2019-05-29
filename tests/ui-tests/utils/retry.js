const MAX_RETRIES = 5;

export const retry = async fn => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await fn();
    } catch (err) {
      console.error(`Error in retry attempt ${i + 1}:`, err);
    }
    console.log(`Retrying... Attempt ${i + 2}/${MAX_RETRIES}`);
  }
};

/*
Inputs: 
  fn - function to be executed in every interval. Should return true when the condition has been fulfilled
  intervalMs - requests repetition interval (in ms). Default is 1000ms
  maxReps - max amount of requests to do
*/
export const retryInterval = async (fn, intervalMs = 1000, maxReps = 30) => {
  let repsCounter = 0;
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      repsCounter++;
      const result = await fn();
      if (result === true || repsCounter === maxReps) {
        clearInterval(interval);
        if (result === true) {
          resolve(result);
        } else {
          reject(
            `Max. amount of retry repetitions reached without expected result. Error: ${result}`,
          );
        }
      }
    }, intervalMs);
  });
};
