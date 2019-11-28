const getAlternativePath = tenantName => {
  const currentPath = window.location.pathname;
  const regex = new RegExp('^/tenant/(.*?)/(.*)(?:/.*)?');
  const match = currentPath.match(regex);
  if (match) {
    const tenant = match[1];
    const path = match[2];
    if (tenant == tenantName) {
      // the same tenant, leave path as it is
      return `${tenantName}/${path}`;
    } else {
      // other tenant, get back to context as applications or runtimes
      const contextOnlyPath = path.split('/')[0];
      return `${tenantName}/${contextOnlyPath}`;
    }
  }
  return null;
};

const getTenants = () => {
  const tenants = window.clusterConfig.tenants || [];
  const tenantNames = tenants.map(tenant => {
    const alternativePath = getAlternativePath(tenant.name);
    return {
      label: tenant.name,
      pathValue: alternativePath || tenant.name,
    };
  });
  return tenantNames;
};

module.exports = {
  getTenants,
};
