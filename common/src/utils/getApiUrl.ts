interface StringMap {
  [s: string]: string;
}

const defaultPrefix = 'REACT_APP_';

export function processConfigEnvVariables(
  sourceObject: StringMap,
  prefix?: string,
): StringMap | undefined {
  const result: StringMap = {};
  for (const prop in sourceObject) {
    if (prop.startsWith(prefix || defaultPrefix)) {
      result[prop.replace(prefix || defaultPrefix, '')] = sourceObject[prop];
    }
  }
  /* tslint:disable */
  console.log(
    'processConfigEnvVariables clusterConfig',
    (window as any).clusterConfig,
  );

  console.log('processConfigEnvVariables sourceObject', sourceObject);
  console.log('processConfigEnvVariables result', result);
  /* tslint:enable */
  return Object.keys(result).length ? result : undefined;
}

export function getApiUrl(endpoint: string): string {
  const clusterConfig = processConfigEnvVariables(
    process.env as StringMap,
    defaultPrefix,
  );
  /* tslint:disable */
  console.log(
    'getApiUrl asked for',
    endpoint,
    'returning',
    clusterConfig && clusterConfig[endpoint]
      ? clusterConfig[endpoint]
      : (window as any).clusterConfig[endpoint],
  );
  /* tslint:enable */
  return clusterConfig && clusterConfig[endpoint]
    ? clusterConfig[endpoint]
    : (window as any).clusterConfig[endpoint];
}
