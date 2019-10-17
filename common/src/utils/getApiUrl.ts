interface StringMap {
  [s: string]: string;
}

const defaultPrefix = 'REACT_APP_';

export function processConfigEnvVariables(
  sourceObject: StringMap,
  prefix?: string,
): StringMap {
  const result: StringMap = {};
  for (const prop in sourceObject) {
    if (prop.startsWith(prefix || defaultPrefix)) {
      result[prop.replace(prefix || defaultPrefix, '')] = sourceObject[prop];
    }
  }
  return result;
}

export function getApiUrl(endpoint: string): string {
  const clusterConfig = processConfigEnvVariables(
    process.env as StringMap,
    defaultPrefix,
  );
  return clusterConfig[endpoint];
}
