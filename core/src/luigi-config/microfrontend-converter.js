import processNodeForLocalDevelopment from './local-development-node-converter';

function buildNode(node, spec, config) {
  var n = {
    label: node.label,
    pathSegment: node.navigationPath.split('/').pop(),
    viewUrl: spec.viewBaseUrl ? spec.viewBaseUrl + node.viewUrl : node.viewUrl,
    hideFromNav: node.showInNavigation === false || undefined,
    order: node.order,
    context: {
      settings: node.settings
        ? { ...node.settings, ...(node.context || {}) }
        : {}
    },
    requiredPermissions: node.requiredPermissions || undefined
  };

  n.context.requiredBackendModules = node.requiredBackendModules || undefined;

  if (node.externalLink) {
    delete n.viewUrl;
    delete n.pathSegment;
    n.externalLink = {
      url: node.externalLink,
      sameWindow: false
    };
  }

  const isLocalDev = window.location.href.startsWith(
    `http://${config.localDomain}:4200`
  );

  if (isLocalDev && n.viewUrl) {
    n = processNodeForLocalDevelopment(n, spec, config);
  }
  return n;
}

function buildNodeWithChildren(specNode, spec, config) {
  var parentNodeSegments = specNode.navigationPath.split('/');
  var children = getDirectChildren(parentNodeSegments, spec, config);
  var node = buildNode(specNode, spec, config);
  if (children.length) {
    node.children = children;
  }
  return node;
}

function getDirectChildren(parentNodeSegments, spec, config) {
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
      return buildNodeWithChildren(node, spec, config);
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
  segmentPrefix
) {
  return spec.navigationNodes
    .filter(function getTopLevelNodes(node) {
      var segments = node.navigationPath.split('/');
      return segments.length === 1;
    })
    .map(function processTopLevelNodes(node) {
      return buildNodeWithChildren(node, spec, config);
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
              preloadUrl: node.localPreloadUrl || spec.preloadUrl
            };
          }
        }

        node.keepSelectedForChildren = true;
      }

      return node;
    });
}
