const defaultPrefix = 'REACT_APP_';

export function processConfigEnvVariables(sourceObject, prefix) {
  const result = {};
  for (const prop in sourceObject) {
    if (prop.startsWith(prefix || defaultPrefix)) {
      result[prop.replace(prefix || defaultPrefix, '')] = sourceObject[prop];
    }
  }
  return Object.keys(result).length ? result : undefined;
}

export function getConfigValue(endpoint) {
  const clusterConfig = processConfigEnvVariables(process.env, defaultPrefix);
  return clusterConfig && clusterConfig[endpoint]
    ? clusterConfig[endpoint]
    : window.clusterConfig[endpoint];
}
