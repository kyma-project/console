var clusterConfig = window['clusterConfig'];

var k8sDomain = (clusterConfig && clusterConfig['domain']) || 'kyma.local';
var k8sServerUrl = 'https://apiserver.' + k8sDomain;

var config = {
  serviceCatalogModuleUrl: 'https://catalog.' + k8sDomain
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
  token = 'Bearer ' + JSON.parse(localStorage.getItem('luigi.auth')).idToken;
}

function getNodes(environment) {
  var nodes = [
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
      pathSegment: 'instances',
      label: 'Instances',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/instances'
    },
    {
      category: 'Service Catalog',
      pathSegment: 'brokers',
      label: 'Brokers',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/brokers'
    },
    {
      category: 'Configuration',
      pathSegment: 'apis',
      label: 'APIs',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/apis'
    },
    {
      category: 'Configuration',
      pathSegment: 'permissions',
      label: 'Permissions',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/permissions'
    },
    {
      category: 'Configuration',
      pathSegment: 'resources',
      label: 'Resources',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/resources'
    },
    {
      category: 'Configuration',
      pathSegment: 'config-maps',
      label: 'Config maps',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/configmaps'
    },
    {
      category: 'Development',
      pathSegment: 'lambdas',
      label: 'Lambdas',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/lambdas'
    },
    {
      category: 'Operation',
      pathSegment: 'deployments',
      label: 'Deployments',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/deployments'
    },
    {
      category: 'Operation',
      pathSegment: 'replica-sets',
      label: 'Replica Sets',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/replicaSets'
    },
    {
      category: 'Operation',
      pathSegment: 'pods',
      label: 'Pods',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/pods'
    },
    {
      category: 'Operation',
      pathSegment: 'services',
      label: 'Services',
      viewUrl:
        '/consoleapp.html#/home/environments/' + environment + '/services'
    },
    {
      category: 'Operation',
      pathSegment: 'secrets',
      label: 'Secrets',
      viewUrl: '/consoleapp.html#/home/environments/' + environment + '/secrets'
    }
  ];

  return nodes;
}

function getEnvs() {
  reloginIfTokenExpired();

  return new Promise(function(resolve, reject) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var envs = [];
        envs.push({
          pathSegment: 'workspace',
          label: 'Workspace',
          viewUrl: '/consoleapp.html#/home/environments/workspace',
          hideFromNav: true
        });
        JSON.parse(xmlHttp.response).items.forEach(env => {
          envName = env.metadata.name;
          envs.push({
            // has to be visible for all views exept 'settings'
            category: 'Environments',
            navigationContext: 'environments',
            label: envName,
            pathSegment: envName,
            context: {
              environmentId: envName
            },
            children: getNodes(envName)
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
    xmlHttp.setRequestHeader('Authorization', token);
    xmlHttp.send(null);
  });
}

function relogin() {
  localStorage.removeItem('luigi.auth');
  location.reload();
}

function reloginIfTokenExpired() {
  var accessTokenExpirationDate = JSON.parse(localStorage.getItem('luigi.auth'))
    .accessTokenExpirationDate;
  var currentDate = new Date();
  if (accessTokenExpirationDate < currentDate) {
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
      redirect_uri: 'http://console-dev.kyma.local:4200',
      logoutUrl: 'http://console-dev.kyma.local:4200',
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
        label: 'Overview',
        defaultPathSegment: 'workspace',
        context: {
          idToken: token
        },
        children: getEnvs
      },
      {
        pathSegment: 'home',
        label: 'Settings',
        context: {
          idToken: token
        },
        children: [
          {
            // has to be visible for all views exept 'settings'
            pathSegment: 'settings',
            label: 'Administration',
            children: [
              {
                pathSegment: 'organisation',
                label: 'General Settings',
                viewUrl: '/consoleapp.html#/home/settings/organisation'
              },
              {
                pathSegment: 'remote-envs',
                label: 'Remote Environments',
                category: 'Integration',
                viewUrl: '/consoleapp.html#/home/settings/remoteEnvs'
              },
              {
                pathSegment: 'service-brokers',
                label: 'Service Brokers',
                category: 'Integration',
                viewUrl: '/consoleapp.html#/home/settings/serviceBrokers'
              },
              {
                pathSegment: 'idp-presets',
                label: 'IDP Presets',
                category: 'Integration',
                viewUrl: '/consoleapp.html#/home/settings/idpPresets'
              },
              {
                pathSegment: 'global-permissions',
                label: 'Global Permissions',
                category: 'Administration',
                viewUrl: '/consoleapp.html#/home/settings/globalPermissions'
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
              }
            ]
          }
        ]
      }
    ]
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
