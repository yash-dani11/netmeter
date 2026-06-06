export const DEFAULT_SAMPLE_COUNT = 3;

export const sleep = (timer: number) =>
  new Promise((res) => {
    setTimeout(res, timer);
  });

export const withSamples = async <T>(
  fn: () => Promise<T>,
  sampleCount: number,
) => {
  const result: T[] = [];
  for (let i = 0; i < sampleCount; i++) {
    try {
      const data = await fn();
      result.push(data);
    } catch (error) {
      console.error(error);
      await sleep(300);
    }
  }
  return result;
};

export const median = (values: number[]) => {
  if (values.length === 0) {
    throw new Error("Cannot compute median of empty values");
  }

  const sortedValues = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 0) {
    return (sortedValues[mid - 1] + sortedValues[mid]) / 2;
  }

  return sortedValues[mid];
};
