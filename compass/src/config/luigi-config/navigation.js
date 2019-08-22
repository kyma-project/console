import { getTenants } from './helpers/navigation-helpers';

const compassMfUrl = window.clusterConfig.microfrontendContentUrl;

const navigation = {
  nodes: () => [
    {
      hideSideNav: true,
      pathSegment: 'overview',
      label: 'Overview',
      viewUrl: compassMfUrl,
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
            tenantId: ':tenantId',
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
                              viewUrl: compassMfUrl + '/application/:applicationId/api/:apiId',
                            },
                          ],
                        },
                        {
                          pathSegment: 'eventApi',
                          children: [
                            {
                              pathSegment: ':eventApiId',
                              viewUrl: compassMfUrl + '/application/:applicationId/eventApi/:eventApiId',
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
    },
  ],

  contextSwitcher: {
    defaultLabel: 'Select Tenant...',
    parentNodePath: '/tenant',
    lazyloadOptions: false,
    options: getTenants,
  },
};

export default navigation;
