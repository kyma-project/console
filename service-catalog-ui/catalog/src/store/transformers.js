import { parseObject } from 'apollo-client-transform';

const ScalarSerializer = {
  parseValue(value) {
    if (typeof value !== 'object') {
      return value;
    }
    return JSON.stringify(value);
  },
};

const ScalarDeserializer = {
  parseValue(value) {
    if (typeof value !== 'string') {
      return value;
    }

    return JSON.parse(value);
  },
};

const getTransformers = fieldTransformer => ({});

export const getLinkTransformers = () => {
  return getTransformers(ScalarSerializer);
};

export const transformDataScalarStringsToObjects = data => {
  if (!data) {
    return data;
  }

  const transformers = getTransformers(ScalarDeserializer);
  parseObject(transformers, data);
  return data;
};

export const transformDataScalarObjectsToStrings = data => {
  if (!data) {
    return data;
  }

  const transformers = getTransformers(ScalarSerializer);
  parseObject(transformers, data);
  return data;
};
