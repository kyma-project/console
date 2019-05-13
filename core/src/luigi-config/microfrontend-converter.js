function buildNode(node, spec, config) {
  var n = {
    label: node.label,
    pathSegment: node.navigationPath.split('/').pop(),
    viewUrl: spec.viewBaseUrl
      ? spec.viewBaseUrl + node.viewUrl
      : node.viewUrl,
    hideFromNav: node.showInNavigation === false || undefined,
    order: node.order,
    context: {
      settings: node.settings
        ? { ...node.settings, ...(node.context || {}) }
        : {}
    },
    requiredPermissions: node.requiredPermissions || undefined
  };

  n.context.requiredBackendModules =
    node.requiredBackendModules || undefined;

  if (node.externalLink) {
    delete n.viewUrl;
    delete n.pathSegment;
    n.externalLink = {
      url: node.externalLink,
      sameWindow: false
    };
  }

  processNodeForLocalDevelopment(n, config);
  return n;
}

function processNodeForLocalDevelopment(node, config) {
  const isLocalDev = window.location.href.startsWith(
    'http://console-dev.kyma.local:4200'
  );
  if (!isLocalDev || !node.viewUrl) {
    return;
  }
  if (node.viewUrl.startsWith('https://console.kyma.local')) {
    node.viewUrl =
      'http://console-dev.kyma.local:4200' +
      node.viewUrl.substring('https://console.kyma.local'.length);
  } else if (
    node.viewUrl.startsWith('https://catalog.kyma.local')
  ) {
    node.viewUrl =
      config.serviceCatalogModuleUrl +
      node.viewUrl.substring('https://catalog.kyma.local'.length);
  } else if (
    node.viewUrl.startsWith('https://instances.kyma.local')
  ) {
    node.viewUrl =
      config.serviceInstancesModuleUrl +
      node.viewUrl.substring('https://instances.kyma.local'.length);
  } else if (
    node.viewUrl.startsWith('https://brokers.kyma.local')
  ) {
    node.viewUrl =
      config.serviceBrokersModuleUrl +
      node.viewUrl.substring('https://brokers.kyma.local'.length);
  } else if (
    node.viewUrl.startsWith('https://lambdas-ui.kyma.local')
  ) {
    node.viewUrl =
      config.lambdasModuleUrl +
      node.viewUrl.substring(
        'https://lambdas-ui.kyma.local'.length
      );
  } else if (node.viewUrl.startsWith('https://log-ui.kyma.local')) {
    node.viewUrl =
      config.logsModuleUrl +
      node.viewUrl.substring('https://log-ui.kyma.local'.length);
  } else if(node.viewUrl.startsWith('https://add-ons.kyma.local')) {
    node.viewUrl =
      config.addOnsModuleUrl +
      node.viewUrl.substring('https://add-ons.kyma.local'.length);
  }
  return node;
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
    .filter(function (node) {
      var currentNodeSegments = node.navigationPath.split('/');
      var isDirectChild =
        parentNodeSegments.length ===
        currentNodeSegments.length - 1 &&
        parentNodeSegments.filter(function (segment) {
          return currentNodeSegments.includes(segment);
        }).length > 0;
      return isDirectChild;
    })
    .map(function mapSecondLevelNodes(node) {
      // map direct children
      return buildNodeWithChildren(node, spec, config);
    });
}

function convertToNavigationTree(name, spec, config, segmentPrefix) {
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
        node.keepSelectedForChildren = true;
      }

      return node;
    });
}

module.exports = convertToNavigationTree;
