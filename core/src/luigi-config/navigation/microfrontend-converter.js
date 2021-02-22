import processNodeForLocalDevelopment from './local-development-node-converter';
import { hideByNodeCategory } from './navigation-helpers';

function resolveViewUrl(name, node, spec, config) {
  if (spec.viewBaseUrl) {
    if (spec.viewBaseUrl.startsWith('http')) {
      // full url, just return viewBaseUrl
      return spec.viewBaseUrl;
    } else {
      // viewBaseUrl is the ingress name
      console.log(`https://${spec.viewBaseUrl}.${config.domain}${node.viewUrl}`);
      return `https://${spec.viewBaseUrl}.${config.domain}${node.viewUrl}`;
    }
  } else {
    return `https://${name}.${config.domain}${node.viewUrl}`;
  }
}

function buildNode(name, node, spec, config, groups) {
  const { label, order, requiredPermissions } = node;
  let n = {
    label,
    pathSegment: node.navigationPath.split('/').pop(),
    viewUrl: resolveViewUrl(name, node, spec, config),
    hideFromNav:
      node.showInNavigation !== undefined ? !node.showInNavigation : false,
    order,
    context: {
      settings: node.settings
        ? { ...node.settings, ...(node.context || {}) }
        : {}
    },
    requiredPermissions,
  };

  n.context.requiredBackendModules = node.requiredBackendModules;
  n.context.groups = groups;

  if (node.externalLink) {
    delete n.viewUrl;
    delete n.pathSegment;
    n.externalLink = {
      url: node.externalLink,
      sameWindow: false
    };
  }

  const isLocalDev = location.hostname.startsWith('console-dev');

  if (isLocalDev && n.viewUrl) {
    n = processNodeForLocalDevelopment(n, spec, config);
  }
  return n;
}

function buildNodeWithChildren(name, specNode, spec, config, groups) {
  var parentNodeSegments = specNode.navigationPath.split('/');
  var children = getDirectChildren(name, parentNodeSegments, spec, config, groups);
  var node = buildNode(name, specNode, spec, config, groups);
  if (children.length) {
    node.children = children;
  }
  return node;
}

function getDirectChildren(name, parentNodeSegments, spec, config, groups) {
  // process only direct children
  return spec.navigationNodes
    .filter(function(node) {
      var currentNodeSegments = node.navigationPath.split('/');
      var isDirectChild =
        parentNodeSegments.length === currentNodeSegments.length - 1 &&
        arraysEqual(parentNodeSegments, currentNodeSegments.slice(0, -1));
      return isDirectChild;
    })
    .map(function mapSecondLevelNodes(node) {
      // map direct children
      return buildNodeWithChildren(name, node, spec, config, groups);
    });
}

function arraysEqual(arr1, arr2) {
  return arr1.every((el, index) => el === arr2[index]);
}

// todo add coreUIViewGroupName handling
export default function convertToNavigationTree(
  name,
  spec,
  config,
  navigation,
  consoleViewGroupName,
  segmentPrefix,
  groups
) {
  return spec.navigationNodes
    .filter(function getTopLevelNodes(node) {
      var segments = node.navigationPath.split('/');
      return segments.length === 1;
    })

    .map(function processTopLevelNodes(node) {
      return buildNodeWithChildren(name, node, spec, config, groups);
    })
    .map(function addSettingsForTopLevelNodes(node) {
      if (spec.category) {
        node.category = spec.category;
      }
      if (!node.externalLink) {
        if (!node.pathSegment.startsWith(segmentPrefix)) {
          node.pathSegment = segmentPrefix + node.pathSegment;
        }
        node.navigationContext = spec.appName ? spec.appName : name;
        node.viewGroup = node.navigationContext;

        node.navigationContext = spec.appName ? spec.appName : name;
        if (
          node.viewUrl &&
          node.viewUrl.indexOf(window.location.origin + '/') === 0
        ) {
          node.viewGroup = consoleViewGroupName;
        } else {
          node.viewGroup = node.navigationContext;
          if (spec.preloadUrl) {
            navigation.viewGroupSettings[node.viewGroup] = {
              preloadUrl: node.localPreloadUrl || spec.preloadUrl || `https://${name}.${config.domain}/preload`
            };
          }
        }

        node.keepSelectedForChildren = true;
      }
      return node;
    })
    .map(n => {
      const showExperimentalViews =
        localStorage.getItem('console.showExperimentalViews') === 'true';
      return hideByNodeCategory(n, showExperimentalViews);
    });
}
