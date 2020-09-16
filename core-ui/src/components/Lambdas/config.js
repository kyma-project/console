export const WEBHOOK_DEFAULTS_CM_NAME = 'serverless-webhook-envs';
export const KYMA_SYSTEM_NAMESPACE = 'kyma-system';

export const WEBHOOK_VALIDATION = {
  RESERVED_ENVS: 'WEBHOOK_VALIDATION_RESERVED_ENVS',
  MIN_REQUEST_CPU: 'WEBHOOK_VALIDATION_MIN_REQUEST_CPU',
  MIN_REQUEST_MEMORY: 'WEBHOOK_VALIDATION_MIN_REQUEST_MEMORY',
};

const jsCodeAndDeps = {
  code: `module.exports = { 
  main: function (event, context) {
    return "Hello World!";
  }
}`,
  deps: `{ 
  "name": "{lambdaName}",
  "version": "1.0.0",
  "dependencies": {}
}`,
};

const defaultCodeAndDeps = {
  nodejs10: { ...jsCodeAndDeps },
  nodejs12: { ...jsCodeAndDeps },
  python38: {
    code: `def main(event, context):
    return "Hello World"`,
    deps: '',
  },
};

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
    'MOD_NAME',
    'NODE_PATH',
    'PYTHON_PATH',
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
    repoFetcherContainerName: 'repo-fetcher',
  },
  defaultLambdaCodeAndDeps: defaultCodeAndDeps,
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
    defaultLambdaCodeAndDeps: getConfigValue('defaultLambdaCodeAndDeps') || {},
  };
}

export function updateConfig(key, value = null) {
  if (value && CONFIG.hasOwnProperty(key)) {
    CONFIG[key] = value;
  }
}

// this object will update by reference by hook in helpers/misc/useConfigData.
export const CONFIG = loadConfig();
