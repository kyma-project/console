import LuigiClient from '@luigi-project/client';
import { clusterConfig } from './clusterConfig';
import {
  fetchTenants,
  getToken,
  getTenantNames,
  getTenantsFromCache,
  customOptionsRenderer,
} from './helpers/navigation-helpers';

const compassMfUrl = clusterConfig.compassModuleUrl;
const token = getToken();
let tenants = [];

(async () => {
  tenants = await fetchTenants();
})();

const getTenantName = tenantId => {
  const tenantsToCheck = tenants.length > 0 ? tenants : getTenantsFromCache();
  const match = tenantsToCheck.find(tenant => tenant.id === tenantId);
  return match ? match.name : null;
};

const openTenantSearch = () => {
  LuigiClient.setTargetOrigin(window.origin);
  LuigiClient.linkManager().openAsModal('/tenant-search', {
    title: 'Search tenants',
    size: 's',
  });
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
      pathSegment: 'tenant-search',
      label: 'Tenant Search',
      viewUrl: compassMfUrl + '/tenant-search',
      context: {
        idToken: token,
        tenants: tenants.length > 0 ? tenants : getTenantsFromCache(),
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
              navigationContext: 'runtimes',
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
                          pathSegment: 'apiPackage',
                          children: [
                            {
                              pathSegment: ':apiPackageId',
                              viewUrl:
                                compassMfUrl +
                                '/application/:applicationId/apiPackage/:apiPackageId',
                              navigationContext: 'api-package',
                              label: 'Api Package Details',
                              children: [
                                {
                                  pathSegment: 'api',
                                  children: [
                                    {
                                      pathSegment: ':apiId',
                                      viewUrl:
                                        compassMfUrl +
                                        '/application/:applicationId/apiPackage/:apiPackageId/api/:apiId',
                                      navigationContext: 'api',
                                      children: [
                                        {
                                          pathSegment: 'edit',
                                          label: 'Edit Api',
                                          viewUrl:
                                            compassMfUrl +
                                            '/application/:applicationId/apiPackage/:apiPackageId/api/:apiId/edit',
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
                                        '/application/:applicationId/apiPackage/:apiPackageId/eventApi/:eventApiId',
                                      navigationContext: 'event-api',
                                      children: [
                                        {
                                          pathSegment: 'edit',
                                          label: 'Edit Api',
                                          viewUrl:
                                            compassMfUrl +
                                            '/application/:applicationId/apiPackage/:apiPackageId/eventApi/:eventApiId/edit',
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
                  ],
                },
              ],
            },
            {
              keepSelectedForChildren: true,
              pathSegment: 'scenarios',
              label: 'Scenarios',
              viewUrl: compassMfUrl + '/scenarios',
              navigationContext: 'scenarios',
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
              label: 'Metadata definitions',
              viewUrl: compassMfUrl + '/metadata-definitions',
              category: 'SETTINGS',
              children: [
                {
                  pathSegment: 'details',
                  children: [
                    {
                      pathSegment: ':definitionKey',
                      label: 'Metadata definition',
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
    options: () => getTenantNames(tenants.filter(t => t.initialized)),
    fallbackLabelResolver: tenantId => getTenantName(tenantId),
    actions: [
      {
        label: 'Search tenants...',
        clickHandler: openTenantSearch,
      },
    ],
    customOptionsRenderer,
  },
  profile: {
    logout: {
      label: 'Logout',
    },
  },
};

export default navigation;
