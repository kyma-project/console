const defaultConfig = {
  functionUsageKind: 'serverless-function',
};

function getConfigValue(field) {
  const clusterConfig = window.clusterConfig;
  const defaultValue = defaultConfig[field] || '';

  if (!clusterConfig) {
    return defaultValue;
  }

  const serverlessConfig = clusterConfig.serverless;
  if (!serverlessConfig) {
    return defaultValue;
  }

  const configValue = serverlessConfig[field];
  if (!configValue) {
    return defaultValue;
  }

  return configValue;
}

function loadConfig() {
  return {
    functionUsageKind: getConfigValue('functionUsageKind'),
  };
}

export const CONFIG = loadConfig();
