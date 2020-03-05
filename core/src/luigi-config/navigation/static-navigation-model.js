import { config } from '../config';

export const coreUIViewGroupName = '_core_ui_';
export const consoleViewGroupName = '_console_';

export function getStaticChildrenNodesForNamespace(){
  return [
    {
      link: '/home/workspace',
      label: 'Back to Namespaces',
      icon: 'nav-back'
    },
    {
      pathSegment: 'details',
      label: 'Overview',
      viewUrl: '/consoleapp.html#/home/namespaces/:namespaceId/details',
      icon: 'product'
    },
    {
      category: { label: 'Service Management', icon: 'add-coursebook' },
      pathSegment: '_service_management_category_placeholder_',
      hideFromNav: true
    },
    {
      category: { label: 'Configuration', icon: 'key-user-settings' },
      pathSegment: '_configuration_category_placeholder_',
      hideFromNav: true
    },
    {
      category: 'Configuration',
      pathSegment: 'permissions',
      navigationContext: 'permissions',
      label: 'Permissions',
      viewUrl:
        '/consoleapp.html#/home/namespaces/:namespaceId/permissions',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'roles',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/namespaces/:namespaceId/permissions/roles/:name'
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
      viewUrl: '/consoleapp.html#/home/namespaces/:namespaceId/resources'
    },
    {
      category: 'Configuration',
      pathSegment: 'config-maps',
      navigationContext: 'config-maps',
      label: 'Config maps',
      viewUrl: '/consoleapp.html#/home/namespaces/:namespaceId/configmaps'
    },
    {
      category: { label: 'Development', icon: 'source-code' },
      pathSegment: '_development_category_placeholder_',
      hideFromNav: true
    },
    {
      category: { label: 'Operation', icon: 'instance' },
      pathSegment: 'deployments',
      navigationContext: 'deployments',
      label: 'Deployments',
      viewUrl: '/consoleapp.html#/home/namespaces/:namespaceId/deployments'
    },
    {
      category: 'Operation',
      pathSegment: 'replica-sets',
      navigationContext: 'replica-sets',
      label: 'Replica Sets',
      viewUrl: '/consoleapp.html#/home/namespaces/:namespaceId/replicaSets'
    },
    {
      category: 'Operation',
      pathSegment: 'pods',
      navigationContext: 'pods',
      label: 'Pods',
      viewUrl: '/consoleapp.html#/home/namespaces/:namespaceId/pods'
    },
    {
      category: 'Operation',
      pathSegment: 'services',
      navigationContext: 'services',
      label: 'Services',
      viewUrl: '/consoleapp.html#/home/namespaces/:namespaceId/services',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/namespaces/:namespaceId/services/:name',
              children: [
                {
                  pathSegment: 'apis',
                  children: [
                    {
                      pathSegment: 'create',
                      viewUrl:
                        '/consoleapp.html#/home/namespaces/:namespaceId/services/:name/apis/create'
                    },
                    {
                      pathSegment: 'details',
                      children: [
                        {
                          pathSegment: ':apiName',
                          viewUrl:
                            '/consoleapp.html#/home/namespaces/:namespaceId/services/:name/apis/details/:apiName'
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
      viewUrl: '/consoleapp.html#/home/namespaces/:namespaceId/secrets',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/namespaces/:namespaceId/secrets/:name'
            }
          ]
        }
      ]
    },
    {
      category: { label: 'Experimental', icon: 'lab' },
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
      viewUrl: '/consoleapp.html#/home/namespaces/workspace',
      hideFromNav: true,
      viewGroup: consoleViewGroupName,
      children: [
        {
          pathSegment: ':namespaceId',
          context: {
            namespaceId: ':namespaceId'
          },
          children: namespaceChildrenNodesResolver,
          navigationContext: 'namespaces',
          defaultChildNode: 'details'
        }
      ]
    },
    {
      category: { label: 'Integration', icon: 'overview-chart' },
      pathSegment: '_integration_category_placeholder_',
      hideFromNav: true
    },
    {
      pathSegment: 'settings',
      navigationContext: 'settings',
      label: 'General Settings',
      category: { label: 'Settings', icon: 'settings' },
      viewUrl: '/consoleapp.html#/home/settings/organisation',
      viewGroup: consoleViewGroupName
    },
    {
      pathSegment: 'global-permissions',
      navigationContext: 'global-permissions',
      label: 'Global Permissions',
      category: 'Settings',
      viewUrl: '/consoleapp.html#/home/settings/globalPermissions',
      keepSelectedForChildren: true,
      viewGroup: consoleViewGroupName,
      children: [
        {
          pathSegment: 'roles',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/settings/globalPermissions/roles/:name'
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
        icon: 'electrocardiogram'
      },
      pathSegment: '_integration_category_placeholder_',
      hideFromNav: true
    },
    {
      category: { label: 'Experimental', icon: 'lab' },
      hideFromNav: true
    }
  ];


}
