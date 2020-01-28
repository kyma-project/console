import {
  fetchTenants,
  getToken,
  getTenantNames,
} from './helpers/navigation-helpers';

const compassMfUrl = window.clusterConfig.microfrontendContentUrl;

let token = getToken();
let tenants = [];

(async () => {
  tenants = await fetchTenants();
})();

const getTenantOptions = () => {
  return getTenantNames(tenants);
};

const getTenantName = tenantId => {
  const match = tenants.find(tenant => tenant.id === tenantId);
  return match ? match.name : null;
};

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
          pathSegment: ':tenantId',
          navigationContext: 'tenant',
          context: {
            idToken: token,
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
    options: getTenantOptions,
    fallbackLabelResolver: tenantId => {
      return getTenantName(tenantId);
    },
  },
};

export default navigation;
