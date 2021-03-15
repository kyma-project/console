export default function processNodeForLocalDevelopment(node, spec, config) {
  const localDevDomainBindings = [
    { startsWith: 'catalog', replaceWith: config.serviceCatalogModuleUrl },
    { startsWith: 'addons', replaceWith: config.addOnsModuleUrl },
    { startsWith: 'log-ui', replaceWith: config.logsModuleUrl },
    { startsWith: 'core-ui', replaceWith: config.coreUIModuleUrl },
  ];

  const { domain, localDomain } = config;
  const isNodeMicroFrontend = node.viewUrl.startsWith(
    `https://console.${domain}`
  );
  const nodePreloadUrl =
    spec.preloadUrl || `https://${name}.${config.domain}/preload`;

  const clusterMicroFrontendDomainBinding = localDevDomainBindings.find((b) =>
    node.viewUrl.startsWith(`https://${b.startsWith}.${domain}`)
  );

  const isNodeClusterMicroFrontend =
    clusterMicroFrontendDomainBinding &&
    node.viewUrl.startsWith(
      `https://${clusterMicroFrontendDomainBinding.startsWith}.${domain}`
    );

  if (isNodeMicroFrontend) {
    node.viewUrl = adjustMicroFrontendUrlForLocalDevelopment(
      node.viewUrl,
      domain,
      localDomain
    );
  }
  if (isNodeMicroFrontend && nodePreloadUrl) {
    node.localPreloadUrl = adjustMicroFrontendUrlForLocalDevelopment(
      nodePreloadUrl,
      domain,
      localDomain
    );
  }

  if (isNodeClusterMicroFrontend) {
    node.viewUrl = adjustClusterMicroFrontendUrlForLocalDevelopment(
      node.viewUrl,
      clusterMicroFrontendDomainBinding,
      domain
    );
  }
  if (isNodeClusterMicroFrontend && nodePreloadUrl) {
    node.localPreloadUrl = adjustClusterMicroFrontendUrlForLocalDevelopment(
      nodePreloadUrl,
      clusterMicroFrontendDomainBinding,
      domain
    );
  }

  return node;
}

function adjustMicroFrontendUrlForLocalDevelopment(url, domain, localDomain) {
  return url.replace(`https://console.${domain}`, `http://${localDomain}:4200`);
}

function adjustClusterMicroFrontendUrlForLocalDevelopment(
  url,
  domainBinding,
  domain
) {
  return url.replace(
    `https://${domainBinding.startsWith}.${domain}`,
    domainBinding.replaceWith
  );
}
