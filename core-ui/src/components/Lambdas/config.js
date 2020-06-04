const defaultCode = `module.exports = { 
  main: function (event, context) {
    return "Hello World!";
  }
}`;

const defaultDeps = `{ 
  "name": "{lambdaName}",
  "version": "1.0.0",
  "dependencies": {}
}`;

const defaultTriggerSubscriber = {
  kind: 'Service',
  apiVersion: 'v1',
  broker: 'default',
};

const defaultConfig = {
  functionUsageKind: 'serverless-function',
  restrictedVariables: [
    'FUNC_RUNTIME',
    'FUNC_HANDLER',
    'FUNC_TIMEOUT',
    'FUNC_PORT',
    'PORT',
    'MOD_NAME',
    'NODE_PATH',
    'REQ_MB_LIMIT',
    'FUNC_MEMORY_LIMIT', // https://github.com/kubeless/runtimes/blob/master/stable/nodejs/kubeless.js
  ],
  resources: {
    min: {
      memory: '16Mi',
      cpu: '10m',
    },
  },
  triggerSubscriber: defaultTriggerSubscriber,
  logging: {
    deploymentContainerName: 'lambda',
    jobContainerName: 'executor',
  },
  defaultLambdaCode: defaultCode,
  defaultLambdaDeps: defaultDeps,
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
    resources: getConfigValue('resources') || {},
    triggerSubscriber: getConfigValue('triggerSubscriber') || {},
    logging: getConfigValue('logging') || {},
    defaultLambdaCode: getConfigValue('defaultLambdaCode') || '',
    defaultLambdaDeps: getConfigValue('defaultLambdaDeps') || '',
  };
}

export const CONFIG = loadConfig();
