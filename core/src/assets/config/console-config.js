var clusterConfig = window['clusterConfig'];
var k8sDomain = (clusterConfig && clusterConfig['domain']) || 'kyma.local';
var k8sServerUrl = 'https://apiserver.' + k8sDomain;

var config = {
  serviceCatalogModuleUrl: 'https://catalog.' + k8sDomain,
  serviceInstancesModuleUrl: 'https://instances.' + k8sDomain,
  lambdasModuleUrl: 'https://lambdas-ui.' + k8sDomain,
  serviceBrokersModuleUrl: 'https://brokers.' + k8sDomain,
  docsModuleUrl: 'https://docs.' + k8sDomain
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
  return [
    {
      pathSegment: 'details',
      label: 'Overview',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/details'
    },
    {
      category: 'Service Catalog',
      navigationContext: 'service-catalog',
      pathSegment: 'service-catalog',
      label: 'Catalog',
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
      category: 'Configuration',
      pathSegment: 'apis',
      navigationContext: 'apis',
      label: 'APIs',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/apis',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'create',
          viewUrl:
            '/consoleapp.html#/home/environments/' +
            environment +
            '/apis/create'
        },
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/environments/' +
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
        '/consoleapp.html#/home/environments/' + environment + '/permissions',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'roles',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/environments/' +
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
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/resources'
    },
    {
      category: 'Configuration',
      pathSegment: 'config-maps',
      navigationContext: 'config-maps',
      label: 'Config maps',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/configmaps'
    },
    {
      category: 'Development',
      pathSegment: 'lambdas',
      navigationContext: 'lambdas',
      label: 'Lambdas',
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
      category: 'Operation',
      pathSegment: 'deployments',
      navigationContext: 'deployments',
      label: 'Deployments',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/deployments'
    },
    {
      category: 'Operation',
      pathSegment: 'replica-sets',
      navigationContext: 'replica-sets',
      label: 'Replica Sets',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/replicaSets'
    },
    {
      category: 'Operation',
      pathSegment: 'pods',
      navigationContext: 'pods',
      label: 'Pods',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/pods'
    },
    {
      category: 'Operation',
      pathSegment: 'services',
      navigationContext: 'services',
      label: 'Services',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/services',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/environments/' +
                environment +
                '/services/:name',
              children: [
                {
                  pathSegment: 'apis',
                  children: [
                    {
                      pathSegment: 'create',
                      viewUrl:
                        '/consoleapp.html#/home/environments/' +
                        environment +
                        '/services/:name/apis/create'
                    },
                    {
                      pathSegment: 'details',
                      children: [
                        {
                          pathSegment: ':apiName',
                          viewUrl:
                            '/consoleapp.html#/home/environments/' +
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
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/secrets',
      keepSelectedForChildren: true,
      children: [
        {
          pathSegment: 'details',
          children: [
            {
              pathSegment: ':name',
              viewUrl:
                '/consoleapp.html#/home/environments/' +
                environment +
                '/secrets/:name'
            }
          ]
        }
      ]
    }
  ];
}

function getEnvs() {
  reloginIfTokenExpired();
  return new Promise(function(resolve, reject) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var envs = [];
        JSON.parse(xmlHttp.response).items.forEach(env => {
          envName = env.metadata.name;
          envs.push({
            // has to be visible for all views exept 'settings'
            category: 'Environments',
            label: envName,
            pathValue: envName
          });
        });
        resolve(envs);
      } else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
        if (xmlHttp.status === 401) {
          relogin();
        }
        reject(xmlHttp.response);
      }
    };

    xmlHttp.open(
      'GET',
      k8sServerUrl + '/api/v1/namespaces?labelSelector=env=true',
      true
    );
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlHttp.send(null);
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
      onAuthSuccessful: data => {
        console.log('onAuthSuccessful', data);
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
  navigation: {
    nodes: () => [
      {
        pathSegment: 'environments',
        label: 'Workspace',
        viewUrl: '/consoleapp.html#/home/environments/workspace',
        hideSideNav: true,
        context: {
          idToken: token
        },
        children: [
          {
            // has to be visible for all views exept 'settings'
            pathSegment: ':environmentId',
            context: {
              environmentId: ':environmentId'
            },
            children: getNodes,
            navigationContext: 'environments'
          }
        ]
      },
      {
        pathSegment: 'home',
        label: 'General Settings',
        context: {
          idToken: token
        },
        children: [
          {
            // has to be visible for all views exept 'settings'
            pathSegment: 'settings',
            navigationContext: 'settings',
            label: 'Administration',
            children: [
              {
                pathSegment: 'organisation',
                navigationContext: 'organisation',
                label: 'General Settings',
                viewUrl: '/consoleapp.html#/home/settings/organisation'
              },
              {
                pathSegment: 'remote-envs',
                navigationContext: 'remote-envs',
                label: 'Remote Environments',
                category: 'Integration',
                viewUrl: '/consoleapp.html#/home/settings/remoteEnvs',
                keepSelectedForChildren: true,
                children: [
                  {
                    pathSegment: 'details',
                    children: [
                      {
                        pathSegment: ':name',
                        viewUrl:
                          '/consoleapp.html#/home/settings/remoteEnvs/:name'
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
                pathSegment: 'global-permissions',
                navigationContext: 'global-permissions',
                label: 'Global Permissions',
                category: 'Administration',
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
                category: 'Diagnostics',
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
              },
              {
                category: 'Documentation',
                link: '/home/docs',
                label: 'Docs'
              }
            ]
          },
          {
            pathSegment: 'docs',
            viewUrl: config.docsModuleUrl,
            hideSideNav: true
          }
        ]
      }
    ],
    contextSwitcher: {
      defaultLabel: 'Select Environment ...',
      parentNodePath: '/environments', // absolute path
      lazyloadOptions: true, // load options on click instead on page load
      options: getEnvs,
      actions: [
        // {
        //   label: '+ New Environment',
        //   link: '/create-environment'
        // }
      ]
    }
  },
  routing: {
    nodeParamPrefix: '~',
    useHashRouting: true
  },
  settings: {
    header: () => ({
      logo: '/assets/logo.svg'
    })
  }
});
