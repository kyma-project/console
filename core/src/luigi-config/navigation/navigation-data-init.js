import {
  CONSOLE_INIT_DATA,
  GET_MICROFRONTENDS,
  GET_NAMESPACES
} from './queries';
import { config } from '../config';
import {
  getStaticChildrenNodesForNamespace,
  getStaticRootNodes,
  consoleViewGroupName
} from './static-navigation-model';
import convertToNavigationTree from './microfrontend-converter';
import navigationPermissionChecker, {
  setInitValues,
  backendModules,
  getGroups
} from './permissions';

import {
  hideDisabledNodes,
  getSystemNamespaces,
  createNamespacesList,
  clearToken,
  getToken
} from './navigation-helpers';

let clusterMicrofrontendNodes = [];
let clusterMicrofrontendNodesForNamespace = [];
const systemNamespaces = getSystemNamespaces(config.systemNamespaces);

export let resolveNavigationNodes;
export let navigation = {
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
    logout: {
      label: 'Logout'
    },
    items: [
      {
        icon: 'settings',
        label: 'Preferences',
        link: '/home/preferences'
      },
      {
        icon: 'download',
        label: 'Get Kubeconfig',
        link: '/home/download-kubeconfig'
      },
    ]
  },
  nodes: new Promise((res) => {
    resolveNavigationNodes = res;
  })
};

export function getNavigationData() {
  return new Promise(function(resolve, reject) {
    let kymaVersion;
    let token = getToken();
    let groups = getGroups(token);
    fetchFromGraphQL(CONSOLE_INIT_DATA, undefined, true)
      .then(
        res => {
          if (res) {
            const modules = res.backendModules;
            const subjectRules = res.selfSubjectRules;
            const cmfs = res.clusterMicroFrontends;
            kymaVersion = (res.versionInfo && res.versionInfo.kymaVersion) ? `Kyma version: ${res.versionInfo.kymaVersion}` : undefined;
            setInitValues(
              (modules && modules.map(m => m.name)) || [],
              subjectRules || []
            );

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
                      'cmf-',
                      groups
                    );
                    return tree;
                  }
                  return [];
                });
              clusterMicrofrontendNodesForNamespace = cmfs
                .filter(
                  cmf =>
                    cmf.placement === 'namespace' ||
                    cmf.placement === 'environment'
                )
                .map(cmf => {
                  // console.log(cmf.name, cmf);
                  if (cmf.navigationNodes) {
                    return convertToNavigationTree(
                      cmf.name,
                      cmf,
                      config,
                      navigation,
                      consoleViewGroupName,
                      'cmf-',
                      groups
                    );
                  }
                  return [];
                });
            }
          }
        },
        err => {
          if (err === 'access denied') {
            clearToken();
            window.location.pathname = '/nopermissions.html';
          }
        }
      )
      // 'Finally' not supported by IE and FIREFOX (if 'finally' is needed, update your .babelrc)
      .then(() => {
        const nodes = [
          {
            pathSegment: 'home',
            hideFromNav: true,
            context: {
              idToken: token,
              groups,
              backendModules,
              systemNamespaces,
              showSystemNamespaces:
                localStorage.getItem('console.showSystemNamespaces') === 'true'
            },
            children: function() {
              const staticNodes = getStaticRootNodes(
                getChildrenNodesForNamespace
              );
              const fetchedNodes = [].concat(...clusterMicrofrontendNodes);
              const nodeTree = [...staticNodes, ...fetchedNodes];
              hideDisabledNodes(
                config.disabledNavigationNodes,
                nodeTree,
                false
              );
              return nodeTree;
            }
          },
        ];

        resolve([nodes, kymaVersion]);
      })
      .catch(err => {
        console.error('Config Init Error', err);
        reject(err);
      });
  });
}

function getNamespaces() {
  const options = {
    showSystemNamespaces:
      localStorage.getItem('console.showSystemNamespaces') === 'true',
    withInactiveStatus: false
  };
  return fetchFromGraphQL(GET_NAMESPACES, options, false).then(res => {
    return createNamespacesList(res.namespaces);
  }).catch(err => {
    console.error('Error while fetching namespaces', err);
  });
}

function fetchFromGraphQL(query, variables, gracefully) {
  return new Promise(function(resolve, reject) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState !== 4) return;
      if (xmlHttp.status == 200) {
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
      } else {
        if (xmlHttp.status === 401) {
          clearToken();
          window.location.pathname = '/nopermissions.html';
        }
        if (!gracefully) {
          reject(xmlHttp.response);
        } else {
          resolve(null);
        }
      }
    };

    const token = getToken();

    xmlHttp.open('POST', config.graphqlApiUrl, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({ query, variables }));
  });
}

function getChildrenNodesForNamespace(context) {
  const namespace = context.namespaceId;
  var staticNodes = getStaticChildrenNodesForNamespace();

  return Promise.all([
    getMicrofrontends(namespace),
    Promise.resolve(clusterMicrofrontendNodesForNamespace)
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
  const groups = getGroups(getToken())

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
              segmentPrefix,
              groups
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
