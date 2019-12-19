import { getTenants } from './helpers/navigation-helpers';

const compassMfUrl = window.clusterConfig.microfrontendContentUrl;

let token = null;
if (localStorage.getItem('luigi.auth')) {
  try {
    token = JSON.parse(localStorage.getItem('luigi.auth')).idToken;
  } catch (e) {
    console.error('Error while reading ID Token: ', e);
  }
}

const navigation = {
  nodes: () => [
    {
      hideSideNav: true,
      pathSegment: 'overview',
      label: 'Overview',
      viewUrl: compassMfUrl,
      context: {
        idToken: token,
      },
      viewGroup: 'compass',
    },
    {
      hideSideNav: true,
      hideFromNav: true,
      pathSegment: 'tenant',
      children: [
        {
          hideSideNav: true,
          pathSegment: ':tenantName',
          navigationContext: 'tenant',
          context: {
            idToken: token,
            tenantName: ':tenantName',
            defaultTenantId: window.clusterConfig.defaultTenant,
            tenants: window.clusterConfig.tenants,
          },
          children: [
            {
              keepSelectedForChildren: true,
              pathSegment: 'runtimes',
              label: 'Runtimes',
              viewUrl: compassMfUrl + '/runtimes',
              children: [
                {
                  pathSegment: 'details',
                  children: [
                    {
                      pathSegment: ':runtimeId',
                      label: 'Runtimes',
                      viewUrl: compassMfUrl + '/runtime/:runtimeId',
                    },
                  ],
                },
              ],
            },
            {
              keepSelectedForChildren: true,
              pathSegment: 'applications',
              label: 'Applications',
              viewUrl: compassMfUrl + '/applications',
              children: [
                {
                  pathSegment: 'details',
                  children: [
                    {
                      pathSegment: ':applicationId',
                      viewUrl: compassMfUrl + '/application/:applicationId',
                      navigationContext: 'application',
                      children: [
                        {
                          pathSegment: 'api',
                          children: [
                            {
                              pathSegment: ':apiId',
                              viewUrl:
                                compassMfUrl +
                                '/application/:applicationId/api/:apiId',
                              navigationContext: 'api',
                              children: [
                                {
                                  pathSegment: 'edit',
                                  label: 'Edit Api',
                                  viewUrl:
                                    compassMfUrl +
                                    '/application/:applicationId/api/:apiId/edit',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          pathSegment: 'eventApi',
                          children: [
                            {
                              pathSegment: ':eventApiId',
                              viewUrl:
                                compassMfUrl +
                                '/application/:applicationId/eventApi/:eventApiId',
                              navigationContext: 'eventApi',
                              children: [
                                {
                                  pathSegment: 'edit',
                                  label: 'Edit Api',
                                  viewUrl:
                                    compassMfUrl +
                                    '/application/:applicationId/eventApi/:eventApiId/edit',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              keepSelectedForChildren: true,
              pathSegment: 'scenarios',
              label: 'Scenarios',
              viewUrl: compassMfUrl + '/scenarios',
              children: [
                {
                  pathSegment: 'details',
                  children: [
                    {
                      pathSegment: ':scenarioName',
                      label: 'Scenario',
                      viewUrl: compassMfUrl + '/scenarios/:scenarioName',
                    },
                  ],
                },
              ],
            },
            {
              keepSelectedForChildren: true,
              pathSegment: 'metadata-definitions',
              label: 'Metadata Definitions',
              viewUrl: compassMfUrl + '/metadata-definitions',
              category: 'SETTINGS',
              children: [
                {
                  pathSegment: 'details',
                  children: [
                    {
                      pathSegment: ':definitionKey',
                      label: 'Metadata Definition',
                      viewUrl:
                        compassMfUrl + '/metadatadefinition/:definitionKey',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      viewGroup: 'compass',
    },
  ],

  contextSwitcher: {
    defaultLabel: 'Select Tenant...',
    parentNodePath: '/tenant',
    lazyloadOptions: true,
    options: getTenants,
  },
};

export default navigation;
