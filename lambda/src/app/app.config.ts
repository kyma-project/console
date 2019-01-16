import { environment } from '../environments/environment';

const defaultDomain = 'kyma.local';
let domain = defaultDomain;
const clusterConfig: object = window['clusterConfig'];
if (clusterConfig && clusterConfig['domain']) {
  domain = clusterConfig['domain'];
}

const defaultFunctionSizesConf = {
  hpaCpuTargetAverageUtilization: 40,
  functionResources: { requests: { cpu: '100m', memory: '100Mi' } },
  functionSizes: [
    {
      size: {
        name: 'S',
        memory: '128Mi',
        cpu: '100m',
        minReplicas: 1,
        maxReplicas: 2,
        description: '',
      },
    },
    {
      size: {
        name: 'M',
        memory: '256Mi',
        cpu: '500m',
        minReplicas: 2,
        maxReplicas: 5,
        description: '',
      },
    },
    {
      size: {
        name: 'L',
        memory: '512Mi',
        cpu: '1.0',
        minReplicas: 5,
        maxReplicas: 10,
        description: '',
      },
    },
  ],
};

let functionSizes = defaultFunctionSizesConf['functionSizes'];
if (clusterConfig && clusterConfig['functionSizes']) {
  functionSizes = clusterConfig['functionSizes'];
}

let functionResourceRequest = defaultFunctionSizesConf['functionResources'];
if (clusterConfig && clusterConfig['functionResources']) {
  functionResourceRequest = clusterConfig['functionResources'];
}

let targetAverageUtilization =
  defaultFunctionSizesConf['hpaCpuTargetAverageUtilization'];
if (clusterConfig && clusterConfig['hpaCpuTargetAverageUtilization']) {
  targetAverageUtilization = clusterConfig['hpaCpuTargetAverageUtilization'];
}

const defaultSubscriptionConfSpec = {
  pushRequestTimeoutMS: 2000,
  maxInFlight: 400,
  includeSubscriptionNameHeader: true,
  eventType: true,
  eventTypeVersion: true,
};

let subscriptionConfigSpec = defaultSubscriptionConfSpec;
if (clusterConfig && clusterConfig['subscriptionConfig']) {
  subscriptionConfigSpec = clusterConfig['subscriptionConfig'];
}

const k8sServerUrl = `https://apiserver.${domain}`;

const config = {
  authIssuer: `https://dex.${domain}`,
  k8sServerUrl,
  kubelessApiUrl: `${k8sServerUrl}/apis/kubeless.io/v1beta1`,
  k8sApiUrl: `${k8sServerUrl}/apis/apps/v1`,
  k8sApiServerUrl: `${k8sServerUrl}/api/v1`,
  apisApiUrl: `${k8sServerUrl}/apis/gateway.kyma-project.io/v1alpha2`,
  serviceBindingUsageUrl: `${k8sServerUrl}/apis/servicecatalog.kyma-project.io/v1alpha1`,
  serviceCatalogApiUrl: `${k8sServerUrl}/apis/servicecatalog.k8s.io/v1beta1`,
  subscriptionApiUrl: `${k8sServerUrl}/apis/eventing.kyma-project.io/v1alpha1`,
  graphqlApiUrl: `https://ui-api.${domain}/graphql`,
  autoscalingUrl: `${k8sServerUrl}/apis/autoscaling/v1`,
  domain,
  functionSizes,
  functionResourceRequest,
  targetAverageUtilization,
  subscriptionConfigSpec,
  metricsUrl: `https://grafana.${domain}/`,
};

if (clusterConfig) {
  config.graphqlApiUrl = environment.localApi
    ? clusterConfig['graphqlApiUrlLocal']
    : clusterConfig['graphqlApiUrl'];
}

export const AppConfig = { ...config };
