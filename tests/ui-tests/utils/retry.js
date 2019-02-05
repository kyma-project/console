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
