interface StringMap {
  [s: string]: string;
}

export function processConfigEnvVariables(
  sourceObject: StringMap,
  prefix: string,
): StringMap {
  const result: StringMap = {};
  for (var prop in sourceObject) {
    if (prop.startsWith(prefix)) {
      result[prop.replace(prefix, '')] = sourceObject[prop];
    }
  }
  return result;
}

export function getApiUrl(endpoint: string): string {
  const clusterConfig = processConfigEnvVariables(
    process.env as StringMap,
    'REACT_APP_',
  );
  return clusterConfig[endpoint];
}
