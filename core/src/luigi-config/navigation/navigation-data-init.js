import {
  fetchConsoleInitData,
  fetchMicrofrontends,
  fetchNamespaces
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

export function getNavigationData(token) {
  return new Promise(function(resolve, reject) {
    const groups = getGroups(token);
    let kymaVersion;

    fetchConsoleInitData(token)
      .then(
        res => {
          kymaVersion = res.versionInfo && `Kyma version: ${res.versionInfo}`;
  
          const cmfs = res.clusterMicroFrontends;
          setInitValues(
            res.backendModules,
            res.selfSubjectRules || []
          );

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
        },
        err => {
          if (err === 'access denied') {
            clearToken();
            window.location.pathname = '/nopermissions.html';
          } else {
            alert('Config init error, see console for more details');
            console.warn(err);
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

async function getNamespaces() {
  let namespaces;
  try {
    namespaces = await fetchNamespaces(getToken());
  } catch(e) {
    console.error('Error while fetching namespaces', e);
    return [];
  }
  if (localStorage.getItem('console.showSystemNamespaces') !== 'true') {
    namespaces = namespaces.filter(ns => !systemNamespaces.includes(ns.name));
  }
  return createNamespacesList(namespaces);
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
    fetchMicrofrontends(namespace, getToken())
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
