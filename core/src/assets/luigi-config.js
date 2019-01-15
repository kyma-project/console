var clusterConfig = window['clusterConfig'];
var k8sDomain = (clusterConfig && clusterConfig['domain']) || 'kyma.local';
var k8sServerUrl = 'https://apiserver.' + k8sDomain;

var config = {
  serviceCatalogModuleUrl: 'https://catalog.' + k8sDomain,
  serviceInstancesModuleUrl: 'https://instances.' + k8sDomain,
  lambdasModuleUrl: 'https://lambdas-ui.' + k8sDomain,
  serviceBrokersModuleUrl: 'https://brokers.' + k8sDomain,
  docsModuleUrl: 'https://docs.' + k8sDomain,
  graphqlApiUrl: 'https://ui-api.' + k8sDomain + '/graphql'
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

function getNodes(context) {
  var environment = context.environmentId;
  var staticNodes = [
    {
      link: '/home/workspace',
      label: 'Back to Home',
      icon: 'nav-back'
    },
    {
      pathSegment: 'details',
      label: 'Overview',
      viewUrl: '/consoleapp.html#/home/namespaces/' + environment + '/details',
      icon: 'product'
    },
    {
      category: { label: 'Service Catalog', icon: 'add-coursebook' },
      navigationContext: 'service-catalog',
      pathSegment: 'service-catalog',
      label: 'Catalog',
      viewGroup: 'catalog',
      viewUrl: config.serviceCatalogModuleUrl,
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':serviceId',
              viewUrl: config.serviceCatalogModuleUrl + '/details/:serviceId'
            }
          ]
        }
      ]
    },
    {
      category: 'Service Catalog',
      keepSelectedForChildren: true,
      pathSegment: 'instances',
      label: 'Instances',
      viewUrl: config.serviceInstancesModuleUrl,
      viewGroup: 'instances',
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl: config.serviceInstancesModuleUrl + '/details/:name'
            }
          ]
        }
      ]
    },
    {
      category: 'Service Catalog',
      pathSegment: 'brokers',
      label: 'Brokers',
      viewUrl: config.serviceBrokersModuleUrl
    },
    {
      category: { label: 'Configuration', icon: 'key-user-settings' },
      pathSegment: 'apis',
      navigationContext: 'apis',
      label: 'APIs',
      viewUrl: '/consoleapp.html#/home/namespaces/' + environment + '/apis',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'create',
          viewUrl:
            '/consoleapp.html#/home/namespaces/' + environment + '/apis/create'
        },
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/namespaces/' +
                environment +
                '/apis/details/:name'
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
        '/consoleapp.html#/home/namespaces/' + environment + '/permissions',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'roles',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/namespaces/' +
                environment +
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
      viewUrl: '/consoleapp.html#/home/namespaces/' + environment + '/resources'
    },
    {
      category: 'Configuration',
      pathSegment: 'config-maps',
      navigationContext: 'config-maps',
      label: 'Config maps',
      viewUrl:
        '/consoleapp.html#/home/namespaces/' + environment + '/configmaps'
    },
    {
      category: { label: 'Development', icon: 'source-code' },
      pathSegment: 'lambdas',
      navigationContext: 'lambdas',
      label: 'Lambdas',
      viewGroup: 'lambdas',
      viewUrl: config.lambdasModuleUrl + '#/lambdas',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'create',
          viewUrl: config.lambdasModuleUrl + '#/create'
        },
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':lambda',
              viewUrl: config.lambdasModuleUrl + '#/lambdas/:lambda'
            }
          ]
        }
      ]
    },
    {
      category: { label: 'Operation', icon: 'instance' },
      pathSegment: 'deployments',
      navigationContext: 'deployments',
      label: 'Deployments',
      viewUrl:
        '/consoleapp.html#/home/namespaces/' + environment + '/deployments'
    },
    {
      category: 'Operation',
      pathSegment: 'replica-sets',
      navigationContext: 'replica-sets',
      label: 'Replica Sets',
      viewUrl:
        '/consoleapp.html#/home/namespaces/' + environment + '/replicaSets'
    },
    {
      category: 'Operation',
      pathSegment: 'pods',
      navigationContext: 'pods',
      label: 'Pods',
      viewUrl: '/consoleapp.html#/home/namespaces/' + environment + '/pods'
    },
    {
      category: 'Operation',
      pathSegment: 'services',
      navigationContext: 'services',
      label: 'Services',
      viewUrl: '/consoleapp.html#/home/namespaces/' + environment + '/services',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/namespaces/' +
                environment +
                '/services/:name',
              children: [
                {
                  pathSegment: 'apis',
                  children: [
                    {
                      pathSegment: 'create',
                      viewUrl:
                        '/consoleapp.html#/home/namespaces/' +
                        environment +
                        '/services/:name/apis/create'
                    },
                    {
                      pathSegment: 'details',
                      children: [
                        {
                          pathSegment: ':apiName',
                          viewUrl:
                            '/consoleapp.html#/home/namespaces/' +
                            environment +
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
      viewUrl: '/consoleapp.html#/home/namespaces/' + environment + '/secrets',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/namespaces/' +
                environment +
                '/secrets/:name'
            }
          ]
        }
      ]
    }
  ];
  return Promise.all([
    getUiEntities('microfrontends', environment),
    getUiEntities('clustermicrofrontends', undefined, [
      'environment',
      'namespace'
    ]),
    getBackendModules()
  ]).then(function(values) {
    var nodeTree = staticNodes;
    nodeTree = [].concat.apply(nodeTree, values[0]);
    nodeTree = [].concat.apply(nodeTree, values[1]);
    const backendModules = values[2].backendModules;
    nodeTree.forEach(node => {
      node.context
        ? (node.context.backendModules = backendModules)
        : (node.context = { backendModules });
    });
    return nodeTree;
  });
}

/**
 * getUiEntities
 * @param {string} entityname microfrontends | clustermicrofrontends
 * @param {array} placements array of strings: namespace | environment | cluster
 */
function getUiEntities(entityname, environment, placements) {
  var fetchUrl =
    k8sServerUrl +
    '/apis/ui.kyma-project.io/v1alpha1/' +
    (environment ? 'namespaces/' + environment + '/' : '') +
    entityname;
  var segmentPrefix = entityname === 'clustermicrofrontends' ? 'cmf-' : 'mf-';

  return fetchFromKyma(fetchUrl)
    .then(result => {
      if (!result.items.length) {
        return [];
      }
      return result.items
        .filter(function(item) {
          // placement only exists in clustermicrofrontends
          return !placements || placements.includes(item.spec.placement);
        })
        .map(function(item) {
          function buildNode(node, spec) {
            var node = {
              label: node.label,
              pathSegment: node.navigationPath.split('/').pop(),
              viewUrl: spec.viewBaseUrl
                ? spec.viewBaseUrl + node.viewUrl
                : node.viewUrl,
              hideFromNav: node.showInNavigation || undefined
            };
            return node;
          }

          function buildNodeWithChildren(specNode, spec) {
            var parentNodeSegments = specNode.navigationPath.split('/');
            var children = getDirectChildren(parentNodeSegments, spec);

            var node = buildNode(specNode, spec);
            if (children.length) {
              node.children = children;
            }
            return node;
          }

          function getDirectChildren(parentNodeSegments, spec) {
            // process only direct childs
            return spec.navigationNodes
              .filter(function(node) {
                var currentNodeSegments = node.navigationPath.split('/');
                var isDirectChild =
                  parentNodeSegments.length ===
                    currentNodeSegments.length - 1 &&
                  parentNodeSegments.filter(function(segment) {
                    return currentNodeSegments.includes(segment);
                  }).length > 0;
                return isDirectChild;
              })
              .map(function mapSecondLevelNodes(node) {
                // map direct childs
                return buildNodeWithChildren(node, spec);
              });
          }

          function buildTree(spec) {
            return spec.navigationNodes
              .filter(function getTopLevelNodes(node) {
                var segments = node.navigationPath.split('/');
                return segments.length === 1;
              })
              .map(function processTopLevelNodes(node) {
                return buildNodeWithChildren(node, spec);
              })
              .map(function addSettingsForTopLevelNodes(node) {
                if (!node.pathSegment.startsWith(segmentPrefix)) {
                  node.pathSegment = segmentPrefix + node.pathSegment;
                }
                if (spec.category) {
                  node.category = spec.category;
                }
                node.navigationContext = spec.appName;
                node.viewGroup = spec.appName;
                node.keepSelectedForChildren = true;
                return node;
              });
          }
          if (item.spec.navigationNodes) {
            var tree = buildTree(item.spec);
            return tree;
          }
          return [];
        });
    })
    .catch(err => {
      console.error('Error fetching UiEntity ' + name, err);
      return [];
    });
}

function fetchFromKyma(url) {
  // reloginIfTokenExpired();
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

function fetchFromGraphQL(query, variables) {
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
        reject(xmlHttp.response);
      }
    };

    xmlHttp.open('POST', config.graphqlApiUrl, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({ query, variables }));
  });
}

function getBackendModules() {
  const query = `query {
    backendModules{
      name
    }
  }`;
  return fetchFromGraphQL(query);
}

function getEnvs() {
  return fetchFromKyma(
    k8sServerUrl + '/api/v1/namespaces?labelSelector=env=true'
  ).then(function(response) {
    var envs = [];
    response.items.map(env => {
      if (env.status && env.status.phase !== 'Active') {
        return; //"pretend" that inactive env is already removed
      }
      envName = env.metadata.name;
      envs.push({
        // has to be visible for all views exept 'settings'
        category: 'Namespaces',
        label: envName,
        pathValue: envName
      });
    });
    return envs;
  });
}

function relogin() {
  localStorage.removeItem('luigi.auth');
  location.reload();
}

function reloginIfTokenExpired() {
  var authData = JSON.parse(localStorage.getItem('luigi.auth'));
  var accessTokenExpirationDate =
    authData && authData.accessTokenExpirationDate;
  var currentDate = new Date();
  if (!authData || accessTokenExpirationDate < currentDate) {
    relogin();
  }
}

Luigi.setConfig({
  auth: {
    use: 'openIdConnect',
    openIdConnect: {
      authority: 'https://dex.' + k8sDomain,
      client_id: 'console',
      scope:
        'audience:server:client_id:kyma-client audience:server:client_id:console openid profile email groups',
      automaticSilentRenew: true,
      loadUserInfo: false
    },

    events: {
      onLogout: () => {
        console.log('onLogout');
      },
      onAuthSuccessful: data => {},
      onAuthExpired: () => {
        console.log('onAuthExpired');
      },
      // TODO: define luigi-client api for getting errors
      onAuthError: err => {
        console.log('authErrorHandler 1', err);
      }
    }
  },
  navigation: {
    nodes: () => [
      {
        pathSegment: 'home',
        hideFromNav: true,
        context: {
          idToken: token
        },
        children: function() {
          return Promise.all([
            getUiEntities('clustermicrofrontends', undefined, ['cluster']),
            getBackendModules()
          ]).then(function(values) {
            var staticNodes = [
              {
                pathSegment: 'workspace',
                label: 'Namespaces',
                viewUrl:
                  '/consoleapp.html#/home/namespaces/workspace?showModal={nodeParams.showModal}',
                icon: 'dimension'
              },
              {
                pathSegment: 'namespaces',
                viewUrl: '/consoleapp.html#/home/namespaces/workspace',
                hideFromNav: true,
                children: [
                  {
                    pathSegment: ':environmentId',
                    context: {
                      environmentId: ':environmentId'
                    },
                    children: getNodes,
                    navigationContext: 'namespaces',
                    defaultChildNode: 'details'
                  }
                ]
              },
              {
                pathSegment: 'apps',
                navigationContext: 'apps',
                label: 'Applications',
                category: { label: 'Integration', icon: 'overview-chart' },
                viewUrl: '/consoleapp.html#/home/settings/apps',
                keepSelectedForChildren: true,
                children: [
                  {
                    pathSegment: 'details',
                    children: [
                      {
                        pathSegment: ':name',
                        viewUrl: '/consoleapp.html#/home/settings/apps/:name'
                      }
                    ]
                  }
                ]
              },
              {
                pathSegment: 'service-brokers',
                navigationContext: 'service-brokers',
                label: 'Service Brokers',
                category: 'Integration',
                viewUrl: '/consoleapp.html#/home/settings/serviceBrokers'
              },
              {
                pathSegment: 'idp-presets',
                navigationContext: 'idp-presets',
                label: 'IDP Presets',
                category: 'Integration',
                viewUrl: '/consoleapp.html#/home/settings/idpPresets'
              },
              {
                pathSegment: 'settings',
                navigationContext: 'settings',
                label: 'General Settings',
                category: { label: 'Settings', icon: 'settings' },
                viewUrl: '/consoleapp.html#/home/settings/organisation'
              },
              {
                pathSegment: 'global-permissions',
                navigationContext: 'global-permissions',
                label: 'Global Permissions',
                category: 'Settings',
                viewUrl: '/consoleapp.html#/home/settings/globalPermissions',
                keepSelectedForChildren: true,
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
                ]
              },
              {
                label: 'Stats & Metrics',
                category: { label: 'Diagnostics', icon: 'electrocardiogram' },
                externalLink: {
                  url: 'https://grafana.' + k8sDomain,
                  sameWindow: false
                }
              },
              {
                label: 'Tracing',
                category: 'Diagnostics',
                externalLink: {
                  url: 'https://jaeger.' + k8sDomain,
                  sameWindow: false
                }
              }
            ];
            var fetchedNodes = [].concat.apply([], values[0]);
            const nodes = [].concat.apply(staticNodes, fetchedNodes);
            const backendModules = values[1].backendModules;
            nodes.forEach(node => {
              node.context
                ? (node.context.backendModules = backendModules)
                : (node.context = { backendModules });
            });
            return nodes;
          });
        }
      },
      {
        pathSegment: 'docs',
        viewUrl: config.docsModuleUrl,
        label: 'Docs',
        hideSideNav: true,
        context: {
          idToken: token
        },
        icon: 'sys-help'
      }
    ],
    contextSwitcher: {
      defaultLabel: 'Select Namespace ...',
      parentNodePath: '/home/namespaces', // absolute path
      lazyloadOptions: true, // load options on click instead on page load
      options: getEnvs,
      actions: [
        {
          label: '+ New Namespace',
          link: '/home/workspace?~showModal=true'
        }
      ]
    }
  },
  routing: {
    nodeParamPrefix: '~',
    skipRoutingForUrlPatterns: [/access_token=/, /id_token=/]
  },
  settings: {
    header: () => {
      logo = clusterConfig.headerLogoUrl
        ? clusterConfig.headerLogoUrl
        : '/assets/logo.svg';
      title = clusterConfig.headerTitle;
      favicon = clusterConfig.faviconUrl;
      return {
        logo,
        title,
        favicon
      };
    }
  }
});
