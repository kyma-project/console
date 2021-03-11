let domain, localDomain, localDevDomainBindings;

export default function processNodeForLocalDevelopment(node, spec, config) {
  ({ domain, localDomain } = config);
  localDevDomainBindings = [
    { startsWith: 'catalog', replaceWith: config.serviceCatalogModuleUrl },
    { startsWith: 'addons', replaceWith: config.addOnsModuleUrl },
    { startsWith: 'log-ui', replaceWith: config.logsModuleUrl },
    { startsWith: 'core-ui', replaceWith: config.coreUIModuleUrl },
  ];

  const isNodeMicroFrontend = node.viewUrl.startsWith(
    `https://console.${domain}`
  );
  let isNodeClusterMicroFrontend = false;
  const nodePreloadUrl =
    spec.preloadUrl || `https://${name}.${config.domain}/preload`;

  const clusterMicroFrontendDomainBinding = localDevDomainBindings.find(
    (domainBinding) => {
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
  if (isNodeMicroFrontend && nodePreloadUrl) {
    node.localPreloadUrl = adjustMicroFrontendUrlForLocalDevelopment(
      nodePreloadUrl
    );
  }

  if (isNodeClusterMicroFrontend) {
    node.viewUrl = adjustClusterMicroFrontendUrlForLocalDevelopment(
      node.viewUrl,
      clusterMicroFrontendDomainBinding
    );
  }
  if (isNodeClusterMicroFrontend && nodePreloadUrl) {
    node.localPreloadUrl = adjustClusterMicroFrontendUrlForLocalDevelopment(
      nodePreloadUrl,
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
