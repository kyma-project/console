const getTenants = () => {
  const tenants = [{
    category: 'Tenants',
    label: 'Tenant 1',
    pathValue: 'tenant1'
  }, {
    category: 'Tenants',
    label: 'Tenant 2',
    pathValue: 'tenant2'
  }];
  return tenants
}

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
      label: 'Tenants',
      children: [
        {
          hideSideNav: true,
          pathSegment: ':tenantId',
          label: 'Tenant',
          navigationContext: 'tenant',
          context: {
            tenantId: ':tenantId'
          },
          children: [
            {
              hideSideNav: true,
              pathSegment: 'runtimes',
              label: 'Runtimes',
              viewUrl: 'http://localhost:3000/runtimes',
            },
            
            {
              hideSideNav: true,
              hideFromNav: true,
              pathSegment: 'runtime',
              children: [
                {
                  hideSideNav: true,
                  hideFromNav: true,
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
    lazyloadOptions: true, // load options on click instead on page load
    options: getTenants,
  }
};

export default navigation;
