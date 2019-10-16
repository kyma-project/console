import { environment } from '../environments/environment';

const defaultFunctionSizesConf = {
  hpaCpuTargetAverageUtilization: 40,
  functionResources: { requests: { cpu: '100m', memory: '100Mi' } },
  functionSizes: [
    {
      size: {
        name: 'XS',
        memory: '128Mi',
        cpu: '100m',
        minReplicas: 1,
        maxReplicas: 1,
        description: '',
      },
    },
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

const defaultSubscriptionConfSpec = {
  includeSubscriptionNameHeader: true,
  eventType: '',
  eventTypeVersion: '',
};


const clusterConfig = (window as any).clusterConfig;



const domain = clusterConfig.domain;
const gateway_kyma_project_io_version = clusterConfig.gateway_kyma_project_io_version;
const k8sServerUrl = `https://apiserver.${domain}`;

const config = {
  authIssuer: `https://dex.${domain}`,
  kubelessApiUrl: `${k8sServerUrl}/apis/kubeless.io/v1beta1`,
  k8sServerUrl,
  k8sApiUrl: `${k8sServerUrl}/apis/apps/v1`,
  k8sApiServerUrl: `${k8sServerUrl}/api/v1`,
  k8sApiServerUrl_apimanagement: `${k8sServerUrl}/apis/gateway.kyma-project.io/${gateway_kyma_project_io_version}/`,
  k8sApiServerUrl_apps: `${k8sServerUrl}/apis/apps/v1/`,
  k8sApiServerUrl_applications: `${k8sServerUrl}/apis/applicationconnector.kyma-project.io/v1alpha1/applications/`,
  k8sApiServerUrl_servicecatalog: `${k8sServerUrl}/apis/servicecatalog.k8s.io/v1beta1/`,
  k8sApiServerUrl_rbac: `${k8sServerUrl}/apis/rbac.authorization.k8s.io/v1/`,

  metricsUrl: `https://grafana.${domain}/`,
  apisApiUrl: `${k8sServerUrl}/apis/gateway.kyma-project.io/v1alpha2`,
  serviceBindingUsageUrl: `${k8sServerUrl}/apis/servicecatalog.kyma-project.io/v1alpha1`,
  serviceCatalogApiUrl: `${k8sServerUrl}/apis/servicecatalog.k8s.io/v1beta1`,
  autoscalingUrl: `${k8sServerUrl}/apis/autoscaling/v1`,

  functionSizes: clusterConfig.functionSizes ||defaultFunctionSizesConf['functionSizes'] ,
  functionResourceRequest:clusterConfig.functionResources || defaultFunctionSizesConf.functionResources,
  targetAverageUtilization:clusterConfig.hpaCpuTargetAverageUtilization||defaultFunctionSizesConf.hpaCpuTargetAverageUtilization,
  subscriptionConfigSpec:clusterConfig.subscriptionConfig ||defaultSubscriptionConfSpec,

  headerTitle: '',
  headerLogoUrl: '',
  faviconUrl: 'favicon.ico',
  kubeconfigGeneratorUrl: `https://configurations-generator.${domain}/kube-config`,
  idpLogoutUrl: null,
  dexFQDNUri: 'http://dex-service.kyma-system.svc.cluster.local:5556/keys',

  ...clusterConfig,
  graphqlApiUrl: environment.localApi ? clusterConfig.graphqlApiUrlLocal:clusterConfig.graphqlApiUrl,
    subscriptionApiUrl: `${k8sServerUrl}/apis/eventing.kyma-project.io/v1alpha1`,
};


export const AppConfig = { ...config } as any;

