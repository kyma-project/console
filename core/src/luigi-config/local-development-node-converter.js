let domain, localDomain, localDevDomainBindings;

export default function processNodeForLocalDevelopment(node, spec, config) {
  ({ domain, localDomain } = config);
  localDevDomainBindings = [
    { startsWith: 'lambdas-ui', replaceWith: config.lambdasModuleUrl },
    { startsWith: 'brokers', replaceWith: config.serviceBrokersModuleUrl },
    { startsWith: 'instances', replaceWith: config.serviceInstancesModuleUrl },
    { startsWith: 'catalog', replaceWith: config.serviceCatalogModuleUrl },
    { startsWith: 'addons', replaceWith: config.addOnsModuleUrl },
    { startsWith: 'log-ui', replaceWith: config.logsModuleUrl }
  ];

  const isNodeMicroFrontend = node.viewUrl.startsWith(
    `https://console.${domain}`
  );
  let isNodeClusterMicroFrontend = false;
  const hasNodePreloadUrl = spec.preloadUrl;

  const clusterMicroFrontendDomainBinding = localDevDomainBindings.find(
    domainBinding => {
      return node.viewUrl.startsWith(
        `https://${domainBinding.startsWith}.${domain}`
      );
    }
  );
  if (clusterMicroFrontendDomainBinding) {
    isNodeClusterMicroFrontend = node.viewUrl.startsWith(
      `https://${clusterMicroFrontendDomainBinding.startsWith}.${domain}`
    );
  }

  if (isNodeMicroFrontend) {
    node.viewUrl = adjustMicroFrontendUrlForLocalDevelopment(node.viewUrl);
  }
  if (isNodeMicroFrontend && hasNodePreloadUrl) {
    node.localPreloadUrl = adjustMicroFrontendUrlForLocalDevelopment(
      spec.preloadUrl
    );
  }

  if (isNodeClusterMicroFrontend) {
    node.viewUrl = adjustClusterMicroFrontendUrlForLocalDevelopment(
      node.viewUrl,
      clusterMicroFrontendDomainBinding
    );
  }
  if (isNodeClusterMicroFrontend && hasNodePreloadUrl) {
    node.localPreloadUrl = adjustClusterMicroFrontendUrlForLocalDevelopment(
      spec.preloadUrl,
      clusterMicroFrontendDomainBinding
    );
  }

  return node;
}

function adjustMicroFrontendUrlForLocalDevelopment(url) {
  return url.replace(`https://console.${domain}`, `http://${localDomain}:4200`);
}

function adjustClusterMicroFrontendUrlForLocalDevelopment(url, domainBinding) {
  return url.replace(
    `https://${domainBinding.startsWith}.${domain}`,
    domainBinding.replaceWith
  );
}
