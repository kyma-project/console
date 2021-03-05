import {
  fetchConsoleInitData,
  fetchMicrofrontends,
  fetchNamespaces,
} from './queries';
import { config } from '../config';
import {
  getStaticChildrenNodesForNamespace,
  getStaticRootNodes,
} from './static-navigation-model';
import convertToNavigationTree from './microfrontend-converter';
import navigationPermissionChecker, {
  setInitValues,
  backendModules,
} from './permissions';

import {
  hideDisabledNodes,
  createNamespacesList,
  clearToken,
  getToken,
} from './navigation-helpers';
import { groups } from '../auth';
import { getInitParams } from '../init-params';

let clusterMicrofrontendNodes = [];
let clusterMicrofrontendNodesForNamespace = [];

export let resolveNavigationNodes;
export let navigation = {
  viewGroupSettings: {
    _core_ui_: {
      preloadUrl: config.coreUIModuleUrl + '/preload',
    },
  },
  nodeAccessibilityResolver: navigationPermissionChecker,
  contextSwitcher: {
    defaultLabel: 'Select Namespace ...',
    parentNodePath: '/home/namespaces', // absolute path
    lazyloadOptions: true, // load options on click instead on page load
    options: getNamespaces,
  },
  profile: {
    logout: {
      label: 'Logout',
    },
    items: [
      {
        icon: 'settings',
        label: 'Preferences',
        link: '/home/preferences',
      },
      {
        icon: 'download',
        label: 'Get Kubeconfig',
        link: '/home/download-kubeconfig',
      },
    ],
  },
  nodes: new Promise((res) => {
    resolveNavigationNodes = res;
  }),
};

export function getNavigationData(token) {
  return new Promise(function (resolve, reject) {
    fetchConsoleInitData(token)
      .then(
        (res) => {
          const cmfs = res.clusterMicroFrontends;
          setInitValues(res.backendModules, res.selfSubjectRules || []);

          clusterMicrofrontendNodes = cmfs
            .filter((cmf) => cmf.placement === 'cluster')
            .map((cmf) => {
              if (cmf.navigationNodes) {
                var tree = convertToNavigationTree(
                  cmf.name,
                  cmf,
                  config,
                  navigation,
                  'cmf-',
                  groups
                );
                return tree;
              }
              return [];
            });
          clusterMicrofrontendNodesForNamespace = cmfs
            .filter(
              (cmf) =>
                cmf.placement === 'namespace' || cmf.placement === 'environment'
            )
            .map((cmf) => {
              // console.log(cmf.name, cmf);
              if (cmf.navigationNodes) {
                return convertToNavigationTree(
                  cmf.name,
                  cmf,
                  config,
                  navigation,
                  'cmf-',
                  groups
                );
              }
              return [];
            });
        },
        (err) => {
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
        const {
          k8sApiUrl,
          bebEnabled,
          systemNamespaces,
          disabledNavigationNodes,
        } = getInitParams();
        const nodes = [
          {
            pathSegment: 'home',
            hideFromNav: true,
            context: {
              idToken: token,
              groups,
              backendModules,
              bebEnabled,
              systemNamespaces,
              showSystemNamespaces:
                localStorage.getItem('console.showSystemNamespaces') === 'true',
              k8sApiUrl,
            },
            children: function () {
              const staticNodes = getStaticRootNodes(
                getChildrenNodesForNamespace
              );
              const fetchedNodes = [].concat(...clusterMicrofrontendNodes);
              const nodeTree = [...staticNodes, ...fetchedNodes];
              hideDisabledNodes(disabledNavigationNodes, nodeTree, false);
              return nodeTree;
            },
          },
        ];

        resolve(nodes);
      })
      .catch((err) => {
        console.error('Config Init Error', err);
        reject(err);
      });
  });
}

async function getNamespaces() {
  const { systemNamespaces } = getInitParams();
  let namespaces;
  try {
    namespaces = await fetchNamespaces(getToken());
  } catch (e) {
    console.error('Error while fetching namespaces', e);
    return [];
  }
  if (localStorage.getItem('console.showSystemNamespaces') !== 'true') {
    namespaces = namespaces.filter((ns) => !systemNamespaces.includes(ns.name));
  }
  return createNamespacesList(namespaces);
}

function getChildrenNodesForNamespace(context) {
  const namespace = context.namespaceId;
  var staticNodes = getStaticChildrenNodesForNamespace();

  return Promise.all([
    getMicrofrontends(namespace),
    Promise.resolve(clusterMicrofrontendNodesForNamespace),
  ])
    .then(function (values) {
      const { disabledNavigationNodes } = getInitParams();
      var nodeTree = [...staticNodes];
      values.forEach(function (val) {
        nodeTree = [].concat.apply(nodeTree, val);
      });

      hideDisabledNodes(disabledNavigationNodes, nodeTree, true);
      return nodeTree;
    })
    .catch((err) => {
      const errParsed = JSON.parse(err);
      console.error('Error', errParsed);
      const settings = {
        text: `Namespace ${errParsed.details.name} not found.`,
        type: 'error',
      };
      LuigiClient.uxManager().showAlert(settings);
    });
}

/**
 * getMicrofrontends
 * @param {string} namespace k8s namespace name
 */
const getMicrofrontends = async (namespace) => {
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
    fetchMicrofrontends(namespace, getToken())
      .then((result) => {
        if (!result.microFrontends || !result.microFrontends.length) {
          return [];
        }
        return result.microFrontends.map(function (item) {
          if (item.navigationNodes) {
            return convertToNavigationTree(
              item.name,
              item,
              config,
              navigation,
              segmentPrefix,
              groups
            );
          }
          return [];
        });
      })
      .catch((err) => {
        console.error(`Error fetching Microfrontend ${name}: ${err}`);
        return [];
      })
      .then((result) => {
        cache[cacheKey] = new Promise(function (resolve) {
          resolve(result);
        });
        return result;
      })
  );
};
