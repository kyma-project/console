import { sample } from 'openapi-sampler';

export const generateExampleSchema = schema => {
  try {
    return sample(schema) || {};
  } catch (e) {
    return {};
  }
};
