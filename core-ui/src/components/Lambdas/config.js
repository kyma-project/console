export const WEBHOOK_DEFAULTS_CM_NAME = 'serverless-webhook-envs';
export const KYMA_SYSTEM_NAMESPACE = 'kyma-system';

export const WEBHOOK_ENVS = {
  RESERVED_ENVS: 'WEBHOOK_VALIDATION_RESERVED_ENVS',

  FUNCTION_REPLICAS_MIN_VALUE: 'WEBHOOK_VALIDATION_FUNCTION_REPLICAS_MIN_VALUE',
  FUNCTION_REPLICAS_DEFAULT_PRESET:
    'WEBHOOK_DEFAULTING_FUNCTION_REPLICAS_DEFAULT_PRESET',
  FUNCTION_REPLICAS_PRESETS_MAP:
    'WEBHOOK_DEFAULTING_FUNCTION_REPLICAS_PRESETS_MAP',

  FUNCTION_RESOURCES_MIN_REQUEST_CPU:
    'WEBHOOK_VALIDATION_FUNCTION_RESOURCES_MIN_REQUEST_CPU',
  FUNCTION_RESOURCES_MIN_REQUEST_MEMORY:
    'WEBHOOK_VALIDATION_FUNCTION_RESOURCES_MIN_REQUEST_MEMORY',
  FUNCTION_RESOURCES_DEFAULT_PRESET:
    'WEBHOOK_DEFAULTING_FUNCTION_RESOURCES_DEFAULT_PRESET',
  FUNCTION_RESOURCES_PRESETS_MAP:
    'WEBHOOK_DEFAULTING_FUNCTION_RESOURCES_PRESETS_MAP',

  BUILD_JOB_RESOURCES_MIN_REQUEST_CPU:
    'WEBHOOK_VALIDATION_BUILD_JOB_RESOURCES_MIN_REQUEST_CPU',
  BUILD_JOB_RESOURCES_MIN_REQUEST_MEMORY:
    'WEBHOOK_VALIDATION_BUILD_JOB_RESOURCES_MIN_REQUEST_MEMORY',
  BUILD_JOB_RESOURCES_DEFAULT_PRESET:
    'WEBHOOK_DEFAULTING_BUILD_JOB_RESOURCES_DEFAULT_PRESET',
  BUILD_JOB_RESOURCES_PRESETS_MAP:
    'WEBHOOK_DEFAULTING_BUILD_JOB_RESOURCES_PRESETS_MAP',
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
  nodejs14: { ...jsCodeAndDeps },
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
  triggerSubscriber: defaultTriggerSubscriber,
  logging: {
    deploymentContainerName: 'function',
    jobContainerName: 'executor',
    repoFetcherContainerName: 'repo-fetcher',
  },
  defaultLambdaCodeAndDeps: defaultCodeAndDeps,

  functionReplicasDefaultPreset: 'S',
  functionReplicasPresets: {
    s: {
      min: '1',
      max: '1',
    },
  },
  functionMinReplicas: 1,

  functionResourcesDefaultPreset: 'M',
  functionResourcesPresets: {
    m: {
      requestCpu: '50m',
      requestMemory: '64Mi',
      limitsCpu: '100m',
      limitsMemory: '128Mi',
    },
  },
  functionMinResources: {
    memory: '16Mi',
    cpu: '10m',
  },

  buildJobResourcesDefaultPreset: 'normal',
  buildJobResourcesPresets: {
    normal: {
      requestCpu: '700m',
      requestMemory: '700Mi',
      limitsCpu: '1100m',
      limitsMemory: '1100Mi',
    },
  },
  buildJobMinResources: {
    memory: '200Mi',
    cpu: '200m',
  },
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
    triggerSubscriber: getConfigValue('triggerSubscriber') || {},
    logging: getConfigValue('logging') || {},
    defaultLambdaCodeAndDeps: getConfigValue('defaultLambdaCodeAndDeps') || {},

    // Function replicas
    functionReplicasDefaultPreset:
      getConfigValue('functionReplicasDefaultPreset') || '',
    functionReplicasPresets: getConfigValue('functionReplicasPresets') || {},
    functionMinReplicas: getConfigValue('functionMinReplicas') || {},

    // Function resources
    functionResourcesDefaultPreset:
      getConfigValue('functionResourcesDefaultPreset') || '',
    functionResourcesPresets: getConfigValue('functionResourcesPresets') || {},
    functionMinResources: getConfigValue('functionMinResources') || {},

    // BuildJob resources
    buildJobResourcesDefaultPreset:
      getConfigValue('buildJobResourcesDefaultPreset') || '',
    buildJobResourcesPresets: getConfigValue('buildJobResourcesPresets') || {},
    buildJobMinResources: getConfigValue('buildJobMinResources') || {},
  };
}

export function updateConfig(key, value = null) {
  if (value && CONFIG.hasOwnProperty(key)) {
    CONFIG[key] = value;
  }
}

// this object will update by reference by hook in helpers/misc/useConfigData.
export const CONFIG = loadConfig();
