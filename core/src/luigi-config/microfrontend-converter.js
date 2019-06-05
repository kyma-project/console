

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
        ? {...node.settings, ...(node.context || {})}
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
  const {domain, localDomain} = config;
  const localDevDomainBindings = [
    {startsWith: "lambdas-ui", replaceWith: config.lambdasModuleUrl},
    {startsWith: "brokers", replaceWith: config.serviceBrokersModuleUrl},
    {startsWith: "instances", replaceWith: config.serviceInstancesModuleUrl},
    {startsWith: "catalog", replaceWith: config.serviceCatalogModuleUrl},
    {startsWith: "add-ons", replaceWith: config.addOnsModuleUrl},
    {startsWith: "log-ui", replaceWith: config.logsModuleUrl}
  ];
  const isLocalDev = window.location.href.startsWith(
    `http://${localDomain}:4200`
  );

  if (!isLocalDev || !node.viewUrl) {
    return;
  }

  //all non-cluster microfrontends
  if (node.viewUrl.startsWith(`https://console.${domain}`)) {
    node.viewUrl = node.viewUrl.replace(
      `https://console.${domain}`,
      `http://${localDomain}:4200`
    );
  }

  //cluster microfrontends
  localDevDomainBindings.forEach(binding=>{
    if (node.viewUrl.startsWith(`https://${binding.startsWith}.${domain}`)) {
      node.viewUrl = node.viewUrl.replace(
        `https://${binding.startsWith}.${domain}`,
        binding.replaceWith
      );
    }
  });

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

function convertToNavigationTree(name, spec, config, navigation, consoleViewGroupName, segmentPrefix) {
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
        if (node.viewUrl && node.viewUrl.indexOf(window.location.origin + '/') === 0) {
          node.viewGroup = consoleViewGroupName;
        } else {
          node.viewGroup = node.navigationContext;
          if (spec.preloadUrl) {
            navigation.viewGroupSettings[node.viewGroup] = {
              preloadUrl: spec.preloadUrl
            };
          }
        }

        node.keepSelectedForChildren = true;
      }

      return node;
    });
}

module.exports = convertToNavigationTree;
