import LuigiClient from '@kyma-project/luigi-client';
import rbacRulesMatched from './rbac-rules-matcher';
import convertToNavigationTree from './microfrontend-converter';
import {
  hideDisabledNodes,
  getSystemNamespaces,
  shouldShowSystemNamespaces,
  saveCurrentLocation,
  getPreviousLocation
} from './navigation-helpers';
import { CONSOLE_INIT_DATA, GET_MICROFRONTENDS } from './queries';

var clusterConfig = window['clusterConfig'] || INJECTED_CLUSTER_CONFIG;
var k8sDomain = (clusterConfig && clusterConfig['domain']) || 'kyma.local';

var k8sServerUrl = 'https://apiserver.' + k8sDomain;

var config = {
  domain: 'kyma.local',
  localDomain: 'console-dev.kyma.local',
  serviceCatalogModuleUrl: 'https://catalog.' + k8sDomain,
  serviceInstancesModuleUrl: 'https://instances.' + k8sDomain,
  lambdasModuleUrl: 'https://lambdas-ui.' + k8sDomain,
  serviceBrokersModuleUrl: 'https://brokers.' + k8sDomain,
  docsModuleUrl: 'https://docs.' + k8sDomain,
  addOnsModuleUrl: 'https://addons.' + k8sDomain,
  logsModuleUrl: 'https://log-ui.' + k8sDomain,
  coreModuleUrl: 'https://core-ui.' + k8sDomain,
  graphqlApiUrl: 'https://console-backend.' + k8sDomain + '/graphql',
  disabledNavigationNodes: '',
  systemNamespaces:
    'compass-system istio-system knative-eventing knative-serving kube-public kube-system kyma-backup kyma-installer kyma-integration kyma-system natss kube-node-lease kubernetes-dashboard serverless-system'
};

if (clusterConfig) {
  for (var propertyName in config) {
    if (clusterConfig.hasOwnProperty(propertyName)) {
      config[propertyName] = clusterConfig[propertyName];
    }
  }
}

var token;
if (localStorage.getItem('luigi.auth')) {
  token = JSON.parse(localStorage.getItem('luigi.auth')).idToken;
}

const consoleViewGroupName = '_console_';
const coreUIViewGroupName = '_core_ui_';
const systemNamespaces = getSystemNamespaces(config.systemNamespaces);

let navigation = {
  viewGroupSettings: {
    _console_: {
      preloadUrl: '/consoleapp.html#/home/preload'
    },
    _core_ui_: {
      preloadUrl: config.coreModuleUrl + '/preload'
    }
  },
  nodeAccessibilityResolver: navigationPermissionChecker,
  contextSwitcher: {
    defaultLabel: 'Select Namespace ...',
    parentNodePath: '/home/namespaces', // absolute path
    lazyloadOptions: true, // load options on click instead on page load
    options: getNamespaces,
    actions: [
      {
        label: '+ New Namespace',
        link: '/home/workspace?~showModal=true'
      }
    ]
  },
  profile: {
    items: [
      {
        icon: 'settings',
        label: 'Settings',
        link: '/home/settings'
      }
    ]
  }
};

function getNodes(context) {
  var namespace = context.namespaceId;
  var staticNodes = [
    {
      link: '/home/workspace',
      label: 'Back to Namespaces',
      icon: 'nav-back'
    },
    {
      pathSegment: 'details',
      label: 'Overview',
      viewUrl: '/consoleapp.html#/home/namespaces/' + namespace + '/details',
      icon: 'product'
    },
    {
      pathSegment: 'apirules',
      label: 'API rules',
      viewUrl: config.coreModuleUrl + '/apirules',
      icon: 'sonography',
      viewGroup: coreUIViewGroupName,
      keepSelectedForChildren: true,
      navigationContext: 'apirules',
      hideFromNav: true,
      children: [
        {
          pathSegment: 'create',
          label: 'Create API rule',
          viewUrl: config.coreModuleUrl + '/apirules/create',
          viewGroup: coreUIViewGroupName,
          hideFromNav: true
        },
        {
          pathSegment: 'details',
          // label: 'Create API rule',
          viewUrl: config.coreModuleUrl + '/apirules/create',
          viewGroup: coreUIViewGroupName,
          hideFromNav: true,
          children: [
            {
              pathSegment: ':apiName',
              viewUrl: config.coreModuleUrl + '/apirules/details/:apiName',
              viewGroup: coreUIViewGroupName,
              hideFromNav: true
            }
          ]
        }
      ]
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
        '/consoleapp.html#/home/namespaces/' + namespace + '/permissions',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'roles',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/namespaces/' +
                namespace +
                '/permissions/roles/:name'
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
      viewUrl: '/consoleapp.html#/home/namespaces/' + namespace + '/resources'
    },
    {
      category: 'Configuration',
      pathSegment: 'config-maps',
      navigationContext: 'config-maps',
      label: 'Config maps',
      viewUrl: '/consoleapp.html#/home/namespaces/' + namespace + '/configmaps'
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
      viewUrl: '/consoleapp.html#/home/namespaces/' + namespace + '/deployments'
    },
    {
      category: 'Operation',
      pathSegment: 'replica-sets',
      navigationContext: 'replica-sets',
      label: 'Replica Sets',
      viewUrl: '/consoleapp.html#/home/namespaces/' + namespace + '/replicaSets'
    },
    {
      category: 'Operation',
      pathSegment: 'pods',
      navigationContext: 'pods',
      label: 'Pods',
      viewUrl: '/consoleapp.html#/home/namespaces/' + namespace + '/pods'
    },
    {
      category: 'Operation',
      pathSegment: 'services',
      navigationContext: 'services',
      label: 'Services',
      viewUrl: '/consoleapp.html#/home/namespaces/' + namespace + '/services',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/namespaces/' +
                namespace +
                '/services/:name',
              children: [
                {
                  pathSegment: 'apis',
                  children: [
                    {
                      pathSegment: 'create',
                      viewUrl:
                        '/consoleapp.html#/home/namespaces/' +
                        namespace +
                        '/services/:name/apis/create'
                    },
                    {
                      pathSegment: 'details',
                      children: [
                        {
                          pathSegment: ':apiName',
                          viewUrl:
                            '/consoleapp.html#/home/namespaces/' +
                            namespace +
                            '/services/:name/apis/details/:apiName'
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
      viewUrl: '/consoleapp.html#/home/namespaces/' + namespace + '/secrets',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/namespaces/' +
                namespace +
                '/secrets/:name'
            }
          ]
        }
      ]
    }
  ];
  return Promise.all([
    getMicrofrontends(namespace),
    Promise.resolve(window.clusterMicrofrontendNodesForNamespace)
  ])
    .then(function(values) {
      var nodeTree = [...staticNodes];
      values.forEach(function(val) {
        nodeTree = [].concat.apply(nodeTree, val);
      });

      hideDisabledNodes(config.disabledNavigationNodes, nodeTree, true);
      return nodeTree;
    })
    .catch(err => {
      const errParsed = JSON.parse(err);
      console.error('Error', errParsed);
      const settings = {
        text: `Namespace ${errParsed.details.name} not found.`,
        type: 'error'
      };
      LuigiClient.uxManager().showAlert(settings);
    });
}

/**
 * We're using Promise based caching approach, since we often
 * execute getNamespace twice at the same time and we only
 * want to do one rest call.
 *
 * @param {string} namespaceName
 * @returns {Promise} nsPromise
 */
async function getNamespace(namespaceName) {
  const cacheName = '_console_namespace_promise_cache_';
  if (!window[cacheName]) {
    window[cacheName] = {};
  }
  const cache = window[cacheName];
  if (!cache[namespaceName]) {
    cache[namespaceName] = fetchFromKyma(
      `${k8sServerUrl}/api/v1/namespaces/${namespaceName}`
    );
  }
  return await cache[namespaceName];
}

/**
 * getMicrofrontends
 * @param {string} namespace k8s namespace name
 */
const getMicrofrontends = async namespace => {
  const segmentPrefix = 'mf-';

  const cacheName = '_console_mf_cache_';
  if (!window[cacheName]) {
    window[cacheName] = {};
  }
  const cache = window[cacheName];
  const cacheKey = segmentPrefix + namespace;
  const fromCache = cache[cacheKey];

  return (
    fromCache ||
    fetchFromGraphQL(GET_MICROFRONTENDS, { namespace }, true)
      .then(result => {
        if (!result.microFrontends || !result.microFrontends.length) {
          return [];
        }
        return result.microFrontends.map(function(item) {
          if (item.navigationNodes) {
            return convertToNavigationTree(
              item.name,
              item,
              config,
              navigation,
              consoleViewGroupName,
              segmentPrefix
            );
          }
          return [];
        });
      })
      .catch(err => {
        console.error(`Error fetching Microfrontend ${name}: ${err}`);
        return [];
      })
      .then(result => {
        cache[cacheKey] = new Promise(function(resolve) {
          resolve(result);
        });
        return result;
      })
  );
};

function fetchFromKyma(url) {
  return new Promise(function(resolve, reject) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        resolve(JSON.parse(xmlHttp.response));
      } else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
        if (xmlHttp.status === 401) {
          relogin();
        }
        reject(xmlHttp.response);
      }
    };

    xmlHttp.open('GET', url, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlHttp.send(null);
  });
}

function fetchFromGraphQL(query, variables, gracefully) {
  return new Promise(function(resolve, reject) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try {
          const response = JSON.parse(xmlHttp.response);
          if (response && response.errors) {
            reject(response.errors[0].message);
          } else if (response && response.data) {
            return resolve(response.data);
          }
          resolve(response);
        } catch {
          reject(xmlHttp.response);
        }
      } else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
        if (xmlHttp.status === 401) {
          relogin();
        }
        if (!gracefully) {
          reject(xmlHttp.response);
        } else {
          resolve(null);
        }
      }
    };

    xmlHttp.open('POST', config.graphqlApiUrl, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({ query, variables }));
  });
}

function postToKyma(url, body) {
  return new Promise(function(resolve, reject) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (
        xmlHttp.readyState == 4 &&
        (xmlHttp.status == 200 || xmlHttp.status == 201)
      ) {
        try {
          const response = JSON.parse(xmlHttp.response);
          resolve(response);
        } catch {
          reject(xmlHttp.response);
        }
      } else if (
        xmlHttp.readyState == 4 &&
        xmlHttp.status != 200 &&
        xmlHttp.status != 201
      ) {
        // TODO: investigate it, falls into infinite loop
        // if (xmlHttp.status === 401) {
        // relogin();
        // }
        // console.log(xmlHttp);
        reject(xmlHttp.response);
      }
    };

    xmlHttp.open('POST', url, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(body));
  });
}

function checkRequiredBackendModules(nodeToCheckPermissionsFor) {
  let hasPermissions = true;
  if (
    nodeToCheckPermissionsFor.context &&
    nodeToCheckPermissionsFor.context.requiredBackendModules &&
    nodeToCheckPermissionsFor.context.requiredBackendModules.length > 0
  ) {
    if (backendModules && backendModules.length > 0) {
      nodeToCheckPermissionsFor.context.requiredBackendModules.forEach(
        module => {
          if (hasPermissions && backendModules.indexOf(module) === -1) {
            hasPermissions = false;
          }
        }
      );
    } else {
      hasPermissions = false;
    }
  }
  return hasPermissions;
}

function navigationPermissionChecker(nodeToCheckPermissionsFor) {
  const noRulesApplied =
    nodeToCheckPermissionsFor.requiredPermissions === null ||
    nodeToCheckPermissionsFor.requiredPermissions === undefined ||
    nodeToCheckPermissionsFor.requiredPermissions.length === 0;

  return (
    (noRulesApplied ||
      rbacRulesMatched(
        nodeToCheckPermissionsFor.requiredPermissions,
        selfSubjectRulesReview
      )) &&
    checkRequiredBackendModules(nodeToCheckPermissionsFor)
  );
}

function getConsoleInitData() {
  const gracefully = true;
  return fetchFromGraphQL(CONSOLE_INIT_DATA, undefined, gracefully);
}

window.addEventListener('message', e => {
  const SHOW_SYSTEM_NAMESPACES_CHANGE_EVENT =
    'showSystemNamespacesChangedEvent';

  if (e.data && e.data.msg === 'luigi.refresh-context-switcher') {
    window.Luigi.cachedNamespaces = null;
  } else if (e.data && e.data.msg === SHOW_SYSTEM_NAMESPACES_CHANGE_EVENT) {
    Luigi.customMessages().sendToAll({
      id: SHOW_SYSTEM_NAMESPACES_CHANGE_EVENT,
      showSystemNamespaces: e.data.showSystemNamespaces
    });
  }
});

function getNamespaces() {
  if (window.Luigi.cachedNamespaces) {
    return createNamespacesList(window.Luigi.cachedNamespaces);
  } else {
    return fetchFromKyma(k8sServerUrl + '/api/v1/namespaces')
      .then(response => {
        window.Luigi.cachedNamespaces = response.items;
        return createNamespacesList(response.items);
      })
      .catch(function catchNamespaces(err) {
        window.Luigi.cachedNamespaces = null;
        console.error('get namespace: error', err);
      });
  }
}

function createNamespacesList(rawNamespaces) {
  var namespaces = [];
  rawNamespaces.map(namespace => {
    if (namespace.status && namespace.status.phase !== 'Active') {
      return; //"pretend" that inactive namespace is already removed
    }
    const namespaceName = namespace.metadata.name;
    const isSystemNamespace = systemNamespaces.some(namespace => {
      return namespace === namespaceName;
    });
    const alternativeLocation = getCorrespondingNamespaceLocation(
      namespaceName
    );
    if (!isSystemNamespace || shouldShowSystemNamespaces()) {
      namespaces.push({
        category: 'Namespaces',
        label: namespaceName,
        pathValue: alternativeLocation || namespaceName
      });
    }
  });
  return namespaces;
}

function getCorrespondingNamespaceLocation(namespaceName) {
  const addressTokens = window.location.pathname.split('/');
  // check if we are in namespaces context
  if (addressTokens[2] !== 'namespaces') {
    return null;
  }
  // check if any path after namespace name exists - if not,
  // it will default to namespace name (and then to '/details')
  if (!addressTokens[4]) {
    return null;
  }
  return namespaceName + '/' + addressTokens.slice(4).join('/');
}

function relogin() {
  saveCurrentLocation();
  localStorage.removeItem('luigi.auth');
  location.reload();
}

function getFreshKeys() {
  // manually re-fetching keys, since this is a major pain point
  // until dex has possibility of no-cache
  return fetch('https://dex.' + k8sDomain + '/keys', { cache: 'no-cache' });
}

let backendModules = [];
let selfSubjectRulesReview = [];
let clusterMicrofrontendNodes = [];
var initPromises = [getFreshKeys()];

if (token) {
  initPromises.push(getConsoleInitData());
} else {
  saveCurrentLocation();
}

Promise.all(initPromises)
  .then(
    res => {
      if (token && res[1]) {
        const modules = res[1].backendModules;
        const subjectRules = res[1].selfSubjectRules;
        const cmfs = res[1].clusterMicroFrontends;
        if (modules && modules.length > 0) {
          modules.forEach(backendModule => {
            backendModules.push(backendModule.name);
          });
        }
        if (subjectRules && subjectRules.length > 0) {
          selfSubjectRulesReview = subjectRules;
        }
        if (cmfs && cmfs.length > 0) {
          clusterMicrofrontendNodes = cmfs
            .filter(cmf => cmf.placement === 'cluster')
            .map(cmf => {
              if (cmf.navigationNodes) {
                var tree = convertToNavigationTree(
                  cmf.name,
                  cmf,
                  config,
                  navigation,
                  consoleViewGroupName,
                  'cmf-'
                );
                return tree;
              }
              return [];
            });
          window.clusterMicrofrontendNodesForNamespace = cmfs
            .filter(
              cmf =>
                cmf.placement === 'namespace' || cmf.placement === 'environment'
            )
            .map(cmf => {
              if (cmf.navigationNodes) {
                return convertToNavigationTree(
                  cmf.name,
                  cmf,
                  config,
                  navigation,
                  consoleViewGroupName,
                  'cmf-'
                );
              }
              return [];
            });
        }
      }
    },
    err => {
      // console.error(err);
    }
  )
  // 'Finally' not supported by IE and FIREFOX (if 'finally' is needed, update your .babelrc)
  .then(() => {
    (navigation.nodes = () => [
      {
        pathSegment: 'home',
        hideFromNav: true,
        context: {
          idToken: token,
          backendModules,
          systemNamespaces,
          showSystemNamespaces:
            localStorage.getItem('console.showSystemNamespaces') === 'true'
        },
        children: function() {
          var staticNodes = [
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
                    environmentId: ':namespaceId',
                    namespaceId: ':namespaceId'
                  },
                  children: getNodes,
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
            }
          ];
          const fetchedNodes = [].concat(...clusterMicrofrontendNodes);
          const nodeTree = [...staticNodes, ...fetchedNodes];
          hideDisabledNodes(config.disabledNavigationNodes, nodeTree, false);
          return nodeTree;
        }
      },
      {
        pathSegment: 'docs',
        viewUrl: config.docsModuleUrl,
        label: 'Docs',
        hideSideNav: true,
        context: {
          idToken: token,
          backendModules
        },
        icon: 'sys-help',
        children: [
          {
            pathSegment: ':group',
            viewUrl: config.docsModuleUrl,
            hideSideNav: true,
            context: {
              group: ':group'
            },
            children: [
              {
                pathSegment: ':topic',
                viewUrl: config.docsModuleUrl,
                hideSideNav: true,
                context: {
                  group: ':group',
                  topic: ':topic'
                }
              }
            ]
          }
        ]
      }
    ]),
      Luigi.setConfig({
        auth: {
          use: 'openIdConnect',
          openIdConnect: {
            authority: 'https://dex.' + k8sDomain,
            client_id: 'console',
            scope:
              'audience:server:client_id:kyma-client audience:server:client_id:console openid profile email groups',
            automaticSilentRenew: true,
            loadUserInfo: false,
            logoutUrl: 'logout.html'
          },

          events: {
            onLogout: () => {
              console.log('onLogout');
            },
            onAuthSuccessful: () => {
              const prevLocation = getPreviousLocation();
              if (prevLocation) {
                window.location.replace(prevLocation);
              }
            },
            onAuthExpired: () => {
              console.log('onAuthExpired');
            },
            // TODO: define luigi-client api for getting errors
            onAuthError: err => {
              console.log('authErrorHandler 1', err);
            }
          }
        },
        navigation,
        routing: {
          nodeParamPrefix: '~',
          skipRoutingForUrlPatterns: [/access_token=/, /id_token=/]
        },
        settings: {
          responsiveNavigation: 'simpleMobileOnly',
          header: () => {
            const logo =
              clusterConfig && clusterConfig.headerLogoUrl
                ? clusterConfig.headerLogoUrl
                : '/assets/logo.svg';
            const title = clusterConfig ? clusterConfig.headerTitle : undefined;
            const favicon = clusterConfig
              ? clusterConfig.faviconUrl
              : undefined;
            return {
              logo,
              title,
              favicon
            };
          }
        }
      });
  })
  .catch(err => {
    console.error('Config Init Error', err);
  });

window.addEventListener('message', e => {
  if (e.data.msg && e.data.msg === 'console.quotaexceeded') {
    const namespace = e.data.namespace;
    const data = e.data.data;
    let limitHasBeenExceeded;
    let limitExceededErrors;
    if (data && data.resourceQuotasStatus) {
      limitHasBeenExceeded = data.resourceQuotasStatus.exceeded;
    }
    if (
      data &&
      data.resourceQuotasStatus &&
      data.resourceQuotasStatus.exceededQuotas &&
      data.resourceQuotasStatus.exceededQuotas.length > 0
    ) {
      limitExceededErrors = setLimitExceededErrorsMessages(
        data.resourceQuotasStatus.exceededQuotas
      );
      const linkdata = {
        goToResourcesConfig: {
          text: 'Resources Configuration',
          url: `/home/namespaces/${namespace}/resources`
        }
      };
      let errorText = `Error ! The following resource quota limit has been exceeded by the given resource:<br>`;
      limitExceededErrors.forEach(error => {
        errorText += `-${error}<br>`;
      });
      errorText += `See {goToResourcesConfig} for details.`;
      const settings = {
        text: errorText,
        type: 'error',
        links: linkdata
      };
      window.postMessage(
        {
          msg: 'luigi.ux.alert.show',
          data: { settings }
        },
        '*'
      );
    }
  }
});

function setLimitExceededErrorsMessages(limitExceededErrors) {
  let limitExceededErrorscomposed = [];
  limitExceededErrors.forEach(resource => {
    if (resource.affectedResources && resource.affectedResources.length > 0) {
      resource.affectedResources.forEach(affectedResource => {
        limitExceededErrorscomposed.push(
          `'${resource.resourceName}' by '${affectedResource}' (${resource.quotaName})`
        );
      });
    }
  });
  return limitExceededErrorscomposed;
}
