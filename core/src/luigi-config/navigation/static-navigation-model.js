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
      viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/details',
      icon: 'product',
      viewGroup: coreUIViewGroupName
    },
    {
      category: 'Workloads',
      pathSegment: 'pods',
      label: 'Pods',
      viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/pods',
      viewGroup: coreUIViewGroupName,
      keepSelectedForChildren: true,
      navigationContext: 'pods',
      context: {
        resourceApiPath: '/api/v1',
        hasDetailsView: false
      },
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':podName',
              viewUrl:
                config.coreModuleUrl +
                '/home/namespaces/:namespaceId/pods/:podName'
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
        config.coreModuleUrl + '/home/namespaces/:namespaceId/replicasets',
      viewGroup: coreUIViewGroupName,
      keepSelectedForChildren: true,
      context: {
        hasDetailsView: false,
        resourceApiPath: '/apis/apps/v1'
      },
      navigationContext: 'replicasets',
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':replicaSetName',
              viewUrl:
                config.coreModuleUrl +
                '/home/namespaces/:namespaceId/replicasets/:replicaSetName'
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
        config.coreModuleUrl + '/home/namespaces/:namespaceId/deployments',
      viewGroup: coreUIViewGroupName,
      context: {
        resourceApiPath: '/apis/apps/v1',
        hasDetailsView: false
      },
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
      viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/services',
      keepSelectedForChildren: true,
      viewGroup: coreUIViewGroupName,
      navigationContext: 'services',
      context: {
        resourceApiPath: '/api/v1',
        hasDetailsView: false
      },
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
        config.coreModuleUrl + '/home/namespaces/:namespaceId/oauth2clients',
      viewGroup: coreUIViewGroupName,
      keepSelectedForChildren: true,
      context: {
        resourceApiPath: '/apis/hydra.ory.sh/v1alpha1',
        hasDetailsView: false
      },
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
      viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/roles',
      keepSelectedForChildren: true,
      viewGroup: coreUIViewGroupName,
      navigationContext: 'permissions',
      context: {
        resourceApiPath: '/apis/rbac.authorization.k8s.io/v1',
        hasDetailsView: false
      },
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
      viewUrl: config.coreModuleUrl + '/home/namespaces/:namespaceId/secrets',
      viewGroup: coreUIViewGroupName,
      keepSelectedForChildren: true,
      context: {
        resourceApiPath: '/api/v1',
        hasDetailsView: false
      },
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
        config.coreModuleUrl + '/home/namespaces/:namespaceId/configmaps',

      context: {
        resourceApiPath: '/api/v1',
        hasDetailsView: false
      },
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
      viewUrl: config.coreModuleUrl + '/namespaces',
      icon: 'dimension',
      viewGroup: coreUIViewGroupName
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
      context: {
        resourceApiPath: '/apis/rbac.authorization.k8s.io/v1',
        hasDetailsView: false
      },
      viewUrl: config.coreModuleUrl + '/home/roles',
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
