import { config } from '../config';
import { getToken } from './navigation-helpers';
import { saveAs } from 'file-saver';

export const coreUIViewGroupName = '_core_ui_';
export const consoleViewGroupName = '_console_';

function downloadKubeconfig() {
  const kubeconfigGeneratorUrl = `https://configurations-generator.${config.domain}/kube-config`;
  const authHeader = { Authorization: `Bearer ${getToken()}` };

  fetch(kubeconfigGeneratorUrl, { headers: authHeader })
    .then(res => res.blob())
    .then(config => saveAs(config, 'kubeconfig.yml'))
    .catch(err => {
      alert('Cannot download kubeconfig.');
      console.warn(err);
    });

  return false; // cancel Luigi navigation
}

function toSearchParamsString(object) {
  return new URLSearchParams(object).toString();
}

export function getStaticChildrenNodesForNamespace() {
  return [
    {
      link: '/home/workspace',
      label: 'Back to Namespaces',
      icon: 'nav-back'
    },
    {
      category: {
        label: 'Workloads',
        icon: 'source-code',
        collapsible: true
      },
      pathSegment: '_workloads_category_placeholder_',
      hideFromNav: true
    },
    {
      category: 'Workloads',
      pathSegment: 'details',
      label: 'Overview',
      order: -1,
      viewUrl: config.coreModuleUrl + '/namespaces/:namespaceId?' +
      toSearchParamsString({
        resourceApiPath: '/api/v1',
      }),
      icon: 'product',
      viewGroup: coreUIViewGroupName
    },
    {
      category: 'Workloads',
      pathSegment: 'pods',
      label: 'Pods',
      viewUrl:
        config.coreModuleUrl +
        '/namespaces/:namespaceId/pods?' +
        toSearchParamsString({
          resourceApiPath: '/api/v1',
          hasDetailsView: true
        }),
      viewGroup: coreUIViewGroupName,
      keepSelectedForChildren: true,
      navigationContext: 'pods',
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':podName',
              viewUrl:
                config.coreModuleUrl +
                '/namespaces/:namespaceId/pods/:podName?' +
                toSearchParamsString({
                  resourceApiPath: '/api/v1'
                }),
            }
          ]
        }
      ]
    },
    {
      category: 'Workloads',
      pathSegment: 'replicasets',
      label: 'Replica Sets',
      viewUrl:
        config.coreModuleUrl +
        '/namespaces/:namespaceId/replicasets?' +
        toSearchParamsString({
          resourceApiPath: '/apis/apps/v1',
          hasDetailsView: true
        }),
      viewGroup: coreUIViewGroupName,
      keepSelectedForChildren: true,

      navigationContext: 'replicasets',
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':replicaSetName',
              viewUrl:
                config.coreModuleUrl +
                '/namespaces/:namespaceId/replicasets/:replicaSetName?' +
                toSearchParamsString({
                  resourceApiPath: '/apis/apps/v1',
                }),
            }
          ]
        }
      ]
    },

    {
      category: 'Workloads',
      pathSegment: 'deployments',

      label: 'Deployments',
      keepSelectedForChildren: true,
      viewUrl:
        config.coreModuleUrl +
        '/namespaces/:namespaceId/deployments?' +
        toSearchParamsString({
          resourceApiPath: '/apis/apps/v1',
          hasDetailsView: false
        }),
      viewGroup: coreUIViewGroupName,
      navigationContext: 'deployments',
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':deploymentName',
              viewUrl:
                config.coreModuleUrl +
                '/home/namespaces/:namespaceId/deployments/:deploymentName'
            }
          ]
        }
      ]
    },
    {
      category: {
        label: 'Discovery and Network',
        icon: 'instance',
        collapsible: true
      },
      pathSegment: '_discovery_and_network_category_placeholder_',
      hideFromNav: true
    },

    {
      category: 'Discovery and Network',
      pathSegment: 'services',
      navigationContext: 'services',
      label: 'Services',
      viewUrl:
        config.coreModuleUrl +
        '/namespaces/:namespaceId/services?' +
        toSearchParamsString({
          resourceApiPath: '/api/v1',
          hasDetailsView: false
        }),
      keepSelectedForChildren: true,
      viewGroup: coreUIViewGroupName,
      navigationContext: 'services',
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':serviceName',
              viewUrl:
                config.coreModuleUrl +
                '/home/namespaces/:namespaceId/services/details/:serviceName',
              viewGroup: coreUIViewGroupName
            }
          ]
        }
      ]
    },
    {
      category: {
        label: 'Service Management',
        icon: 'add-coursebook',
        collapsible: true
      },
      pathSegment: '_service_management_category_placeholder_',
      hideFromNav: true
    },
    {
      category: {
        label: 'Configuration',
        icon: 'key-user-settings',
        collapsible: true
      },
      pathSegment: '_configuration_category_placeholder_',
      hideFromNav: true
    },
    {
      category: 'Configuration',
      pathSegment: 'oauth2clients',
      navigationContext: 'oauth2clients',
      label: 'OAuth Clients',
      viewUrl:
        config.coreModuleUrl +
        '/namespaces/:namespaceId/oauth2clients?' +
        toSearchParamsString({
          resourceApiPath: '/apis/hydra.ory.sh/v1alpha1',
          hasDetailsView: false
        }),
      viewGroup: coreUIViewGroupName,
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'create',
          viewUrl:
            config.coreModuleUrl +
            '/home/namespaces/:namespaceId/oauth-clients/create',
          viewGroup: coreUIViewGroupName
        },
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':clientName',
              viewUrl:
                config.coreModuleUrl +
                '/home/namespaces/:namespaceId/oauth-clients/details/:clientName',
              viewGroup: coreUIViewGroupName
            }
          ]
        }
      ]
    },
    {
      category: 'Configuration',
      pathSegment: 'permissions',
      navigationContext: 'permissions',
      label: 'Permissions',
      viewUrl:
        config.coreModuleUrl +
        '/namespaces/:namespaceId/roles?' +
        toSearchParamsString({
          resourceApiPath: '/apis/rbac.authorization.k8s.io/v1',
          hasDetailsView: false
        }),
      keepSelectedForChildren: true,
      viewGroup: coreUIViewGroupName,
      navigationContext: 'permissions',
      children: [
        {
          pathSegment: 'roles',
          children: [
            {
              pathSegment: ':roleName',
              viewUrl:
                config.coreModuleUrl +
                '/home/namespaces/:namespaceId/roles/:roleName',
              viewGroup: coreUIViewGroupName
            }
          ]
        }
      ]
    },
    {
      category: 'Configuration',
      pathSegment: 'secrets',
      navigationContext: 'secrets',
      label: 'Secrets',
      viewUrl:
        config.coreModuleUrl +
        '/namespaces/:namespaceId/secrets?' +
        toSearchParamsString({
          resourceApiPath: '/api/v1',
          hasDetailsView: false
        }),
      viewGroup: coreUIViewGroupName,
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                config.coreModuleUrl +
                '/home/namespaces/:namespaceId/secrets/details/:name',
              viewGroup: coreUIViewGroupName
            }
          ]
        }
      ]
    },
    {
      category: 'Configuration',
      pathSegment: 'config-maps',
      navigationContext: 'config-maps',
      label: 'Config Maps',
      viewUrl:
        config.coreModuleUrl +
        '/namespaces/:namespaceId/configmaps?' +
        toSearchParamsString({
          resourceApiPath: '/api/v1',
          hasDetailsView: false
        }),
      viewGroup: coreUIViewGroupName
    },
    {
      category: { label: 'Experimental', icon: 'lab', collapsible: true },
      hideFromNav: true
    }
  ];
}

export function getStaticRootNodes(namespaceChildrenNodesResolver) {
  return [
    {
      pathSegment: 'workspace',
      label: 'Namespaces',
      viewUrl:
        config.coreModuleUrl +
        '/namespaces?' +
        toSearchParamsString({
          resourceApiPath: '/api/v1',
          hasDetailsView: true
        }),
      icon: 'dimension',
      viewGroup: coreUIViewGroupName,
    },
    {
      pathSegment: 'namespaces',
      viewUrl: '/consoleapp.html#/home/namespaces/workspace',
      hideFromNav: true,
      viewGroup: coreUIViewGroupName,
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
      category: {
        label: 'Integration',
        icon: 'overview-chart',
        collapsible: true
      },
      pathSegment: '_integration_category_placeholder_',
      hideFromNav: true
    },
    {
      pathSegment: 'preferences',
      navigationContext: 'settings',
      viewUrl: '/consoleapp.html#/home/settings/preferences',
      viewGroup: consoleViewGroupName,
      hideFromNav: true
    },
    {
      pathSegment: 'download-kubeconfig',
      navigationContext: 'settings',
      hideFromNav: true,
      onNodeActivation: downloadKubeconfig
    },
    {
      pathSegment: 'global-permissions',
      navigationContext: 'global-permissions',
      label: 'Global Permissions',
      category: {
        label: 'Administration',
        icon: 'settings',
        collapsible: true
      },
      viewUrl:
        config.coreModuleUrl +
        '/clusterroles?' +
        toSearchParamsString({
          resourceApiPath: '/apis/rbac.authorization.k8s.io/v1',
          hasDetailsView: false
          // limit: 2
        }),
      keepSelectedForChildren: true,
      viewGroup: coreUIViewGroupName,
      children: [
        {
          pathSegment: 'roles',
          children: [
            {
              pathSegment: ':roleName',
              viewUrl:
                config.coreModuleUrl +
                '/home/global-permission/roles/:roleName',
              viewGroup: coreUIViewGroupName
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
        collapsible: true
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
