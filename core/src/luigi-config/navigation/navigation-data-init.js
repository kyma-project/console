import { CONSOLE_INIT_DATA, GET_MICROFRONTENDS, GET_NAMESPACES } from './queries';
import { config } from '../config';
import { getStaticChildrenNodesForNamespace, getStaticRootNodes, consoleViewGroupName } from './static-navigation-model';
import convertToNavigationTree from './microfrontend-converter';
import navigationPermissionChecker, {
  setInitValues,
  backendModules
} from './permissions';

import {
  hideDisabledNodes,
  getSystemNamespaces,
  createNamespacesList,
  saveCurrentLocation
} from './navigation-helpers';

let clusterMicrofrontendNodes = [];
let clusterMicrofrontendNodesForNamespace = [];
const systemNamespaces = getSystemNamespaces(config.systemNamespaces);


export function getToken(){
  let token;
  const authData = Luigi.auth().store.getAuthData();
  if(authData){
    token = authData.idToken;
  }
  return token
}

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
    items: [
      {
        icon: 'settings',
        label: 'Settings',
        link: '/home/settings'
      }
    ]
  }
};

export function getNavigationData() {
  return new Promise(function(resolve, reject) {
    let kymaVersion;
    let token = getToken();
    fetchFromGraphQL(CONSOLE_INIT_DATA, undefined, true)
    .then(
      res => {
        if (res) {
          const modules = res.backendModules;
          const subjectRules = res.selfSubjectRules;
          const cmfs = res.clusterMicroFrontends;
          kymaVersion = `Kyma version: ${res.versionInfo.kymaVersion}`;
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
                    'cmf-'
                  );
                  return tree;
                }
                return [];
              });
            clusterMicrofrontendNodesForNamespace = cmfs
              .filter(
                cmf =>
                  cmf.placement === 'namespace' || cmf.placement === 'environment'
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
      const nodes = [
        {
          pathSegment: 'home',
          hideFromNav: true,
          context: {
            idToken: token,
            backendModules,
            systemNamespaces,
            showSystemNamespaces: localStorage.getItem('console.showSystemNamespaces') === 'true'
          },
          children: function() {
            const staticNodes = getStaticRootNodes(getChildrenNodesForNamespace)
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
      ]
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
    showSystemNamespaces : localStorage.getItem('console.showSystemNamespaces') === 'true',
    withInactiveStatus : false,
  }
  return fetchFromGraphQL(GET_NAMESPACES, options, true)
    .then(
      res => {
        return createNamespacesList(res.namespaces);
      }
    );
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

    const token = getToken();

    xmlHttp.open('POST', config.graphqlApiUrl, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({ query, variables }));
  });
}

function relogin() {
  saveCurrentLocation();
  Luigi.auth().store.removeAuthData()
  location.reload();
}

function getChildrenNodesForNamespace(context) {
  const namespace = context.namespaceId;
  var staticNodes = getStaticChildrenNodesForNamespace(namespace)

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
