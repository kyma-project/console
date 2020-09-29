import { config } from '../config';
import { getToken } from './navigation-helpers';
import { saveAs } from 'file-saver';
export const coreUIViewGroupName = '_core_ui_';
export const consoleViewGroupName = '_console_';
function downloadKubeconfig() {
  const kubeconfigGeneratorUrl = `https://configurations-generator.${config.domain}/kube-config`;
  const authHeader = { "Authorization": `Bearer ${getToken()}` };
  fetch(kubeconfigGeneratorUrl, { headers: authHeader })
    .then(res => res.blob())
    .then(config => saveAs(config, 'kubeconfig.yml'))
    .catch(err => {
      alert('Cannot download kubeconfig.');
      console.warn(err);
    });
  return false; // cancel Luigi navigation
}
export function getStaticChildrenNodesForNamespace(){
  // config.coreAppUrl = 'http://console-dev.testowy.hasselhoff.shoot.canary.k8s-hana.ondemand.com:4200' + '/consoleapp.html#';
  return [
    {
      link: '/home/workspace',
      label: 'Back to Namespaces',
      icon: 'nav-back'
    },
    {
      pathSegment: 'details',
      label: 'Overview',
      viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/details',
      icon: 'product',
      viewGroup: coreUIViewGroupName
    },
    {
      category: { label: 'Service Management', icon: 'add-coursebook', collapsible: true },
      pathSegment: '_service_management_category_placeholder_',
      hideFromNav: true
    },
    {
      category: { label: 'Configuration', icon: 'key-user-settings', collapsible: true },
      pathSegment: '_configuration_category_placeholder_',
      hideFromNav: true
    },
    {
      category: 'Configuration',
      pathSegment: 'permissions',
      navigationContext: 'permissions',
      label: 'Permissions',
      viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/permissions',
      keepSelectedForChildren: true,
      viewGroup: coreUIViewGroupName,
      children: [
        {
          pathSegment: 'roles',
          children: [
            {
              pathSegment: ':roleName',
              viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/permissions/roles/:roleName',
              viewGroup: coreUIViewGroupName
            }
          ]
        }
      ]
    },
    {
      category: 'Configuration',
      pathSegment: 'resources',
      navigationContext: 'resources',
      label: 'Resources',
      viewUrl: config.coreAppUrl +'/home/namespaces/:namespaceId/resources',
      viewGroup: consoleViewGroupName
    },
    {
      category: 'Configuration',
      pathSegment: 'config-maps',
      navigationContext: 'config-maps',
      label: 'Config Maps',
      viewUrl: config.coreAppUrl +'/home/namespaces/:namespaceId/configmaps',
      viewGroup: consoleViewGroupName
    },
    {
      category: { label: 'Development', icon: 'source-code', collapsible: true },
      pathSegment: '_development_category_placeholder_',
      hideFromNav: true
    },
    {
      category: { label: 'Operation', icon: 'instance', collapsible: true },
      pathSegment: 'deployments',
      navigationContext: 'deployments',
      label: 'Deployments',
      viewUrl: config.coreAppUrl +'/home/namespaces/:namespaceId/deployments',
      viewGroup: consoleViewGroupName
    },
    {
      category: 'Operation',
      pathSegment: 'replica-sets',
      navigationContext: 'replica-sets',
      label: 'Replica Sets',
      viewUrl: config.coreAppUrl +'/home/namespaces/:namespaceId/replicaSets',
      viewGroup: consoleViewGroupName
    },
    {
      category: 'Operation',
      pathSegment: 'pods',
      navigationContext: 'pods',
      label: 'Pods',
      viewUrl: config.coreAppUrl +'/home/namespaces/:namespaceId/pods',
      viewGroup: consoleViewGroupName
    },
    {
      category: 'Operation',
      pathSegment: 'services',
      navigationContext: 'services',
      label: 'Services',
      viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/services',
      keepSelectedForChildren: true,
      viewGroup: coreUIViewGroupName,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':serviceName',
              viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/services/details/:serviceName',
              children: [
                {
                  pathSegment: 'apis',
                  children: [
                    {
                      pathSegment: 'create',
                      viewUrl:
                        config.coreAppUrl +'/home/namespaces/:namespaceId/services/:name/apis/create'
                    },
                    {
                      pathSegment: 'details',
                      children: [
                        {
                          pathSegment: ':apiName',
                          viewUrl:
                            config.coreAppUrl +'/home/namespaces/:namespaceId/services/:name/apis/details/:apiName'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      category: 'Operation',
      pathSegment: 'secrets',
      navigationContext: 'secrets',
      label: 'Secrets',
      viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/secrets',
      viewGroup: '_core_ui_',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/secrets/details/:name',
              viewGroup: '_core_ui_',
            }
          ]
        }
      ]
    },
    {
      category: { label: 'Experimental', icon: 'lab', collapsible: true },
      hideFromNav: true
    }
  ];
}
export function getStaticRootNodes(namespaceChildrenNodesResolver){
  return [
    {
      pathSegment: 'workspace',
      label: 'Namespaces',
      viewUrl: config.coreModuleUrl + '/namespaces',
      icon: 'dimension',
      viewGroup: coreUIViewGroupName
    },
    {
      pathSegment: 'namespaces',
      viewUrl: config.coreAppUrl +'/home/namespaces/workspace',
      hideFromNav: true,
      viewGroup: consoleViewGroupName,
      children: [
        {
          pathSegment: ':namespaceId',
          context: {
            namespaceId: ':namespaceId',
            environmentId: ':namespaceId'
          },
          children: namespaceChildrenNodesResolver,
          navigationContext: 'namespaces',
          defaultChildNode: 'details'
        }
      ]
    },
    {
      category: { label: 'Integration', icon: 'overview-chart', collapsible: true },
      pathSegment: '_integration_category_placeholder_',
      hideFromNav: true
    },
    {
      pathSegment: 'preferences',
      navigationContext: 'settings',
      viewUrl: config.coreAppUrl +'/home/settings/preferences',
      viewGroup: consoleViewGroupName,
      hideFromNav: true,
    },
    {
      pathSegment: 'download-kubeconfig',
      navigationContext: 'settings',
      hideFromNav: true,
      onNodeActivation: downloadKubeconfig,
    },
    {
      pathSegment: 'global-permissions',
      navigationContext: 'global-permissions',
      label: 'Global Permissions',
        category: { label: 'Administration', icon: 'settings', collapsible: true },
      viewUrl: config.coreModuleUrl + '/home/global-permissions',
      keepSelectedForChildren: true,
      viewGroup: coreUIViewGroupName,
      children: [
        {
          pathSegment: 'roles',
          children: [
            {
              pathSegment: ':roleName',
              viewUrl:
              config.coreModuleUrl + '/home/global-permission/roles/:roleName'
            }
          ]
        }
      ],
      requiredPermissions: [
        {
          apiGroup: 'rbac.authorization.k8s.io',
          resource: 'clusterrolebindings',
          verbs: ['create']
        }
      ]
    },
    {
      category: {
        label: 'Diagnostics',
        icon: 'electrocardiogram',
        collapsible: true,
      },
      pathSegment: '_integration_category_placeholder_',
      hideFromNav: true
    },
    {
      category: { label: 'Experimental', icon: 'lab', collapsible: true },
      hideFromNav: true
    }
  ];
}