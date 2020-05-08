const defaultConfig = {
  functionUsageKind: 'serverless-function',
};

function getConfigValue(field) {
  const serverlessConfig = window.clusterConfig?.serverless;
  const defaultValue = defaultConfig[field] || '';

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
