const getAlternativePath = tenantUId => {
  const currentPath = window.location.pathname;
  const regex = new RegExp('^/tenant/(.*?)/(.*)(?:/.*)?');
  const match = currentPath.match(regex);
  if (match) {
    const tenant = match[1];
    const path = match[2];
    if (tenant == tenantUId) {
      // the same tenant, leave path as it is
      return `${tenantUId}/${path}`;
    } else {
      // other tenant, get back to context as applications or runtimes
      const contextOnlyPath = path.split('/')[0];
      return `${tenantUId}/${contextOnlyPath}`;
    }
  }
  return null;
};

const getTenants = () => {
  const tenantsString = window.clusterConfig.tenants || '';
  const defaultTenant = window.clusterConfig.defaultTenant || '';
  const tenantsUIDs = tenantsString.split(' ');

  const tenants = tenantsUIDs.map(tenantUId => {
    const alternativePath = getAlternativePath(tenantUId);
    return {
      label: tenantUId === defaultTenant ? 'default' : tenantUId,
      pathValue: alternativePath || tenantUId,
    };
  });
  return tenants;
};

module.exports = {
  getTenants,
};
