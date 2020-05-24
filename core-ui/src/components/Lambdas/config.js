const defaultConfig = {
  functionUsageKind: 'serverless-function',
  restrictedVariables: [
    'K_REVISION',
    'K_CONFIGURATION',
    'K_SERVICE',
    'FUNC_RUNTIME',
    'FUNC_HANDLER',
    'FUNC_TIMEOUT',
    'FUNC_PORT',
    'PORT',
    'MOD_NAME',
    'NODE_PATH',
  ],
};

function getConfigValue(field) {
  const serverlessConfig = window.clusterConfig?.serverless;
  const defaultValue = defaultConfig[field];

  if (!serverlessConfig) {
    return defaultValue;
  }

  return serverlessConfig[field] || defaultValue;
}

function loadConfig() {
  return {
    functionUsageKind: getConfigValue('functionUsageKind') || '',
    restrictedVariables: getConfigValue('restrictedVariables') || [],
  };
}

export const CONFIG = loadConfig();
