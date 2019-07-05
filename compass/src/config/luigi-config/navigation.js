import { getTenants } from './helpers/navigation-helpers'

const navigation = {
  nodes: () => [
    {
      hideSideNav: true,
      pathSegment: 'overview',
      label: 'Overview',
      viewUrl: 'http://localhost:3000/',
    },
    {
      hideSideNav: true,
      hideFromNav: true,
      pathSegment: 'tenant',
      children: [
        {
          hideSideNav: true,
          pathSegment: ':tenantId',
          navigationContext: 'tenant',
          context: {
            tenantId: ':tenantId'
          },
          children: [
            {
              keepSelectedForChildren: true,
              pathSegment: 'runtimes',
              label: 'Runtimes',
              viewUrl: 'http://localhost:3000/runtimes',
            },
            
            {
              pathSegment: 'runtime',
              children: [
                {
                  pathSegment: ':runtimeId',
                  label: 'Runtimes',
                  viewUrl: 'http://localhost:3000/runtime/:runtimeId',
                },
              ],
            },
          ]
        }
      ]
    }
  ],

  contextSwitcher: {
    defaultLabel: 'Select Tenant...',
    parentNodePath: '/tenant', 
    lazyloadOptions: false,
    options: getTenants,
  }
};

export default navigation;
