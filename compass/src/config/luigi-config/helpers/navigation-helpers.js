const getTenants = () => {
  const tenantsString = window.clusterConfig.tenants || '';
  const defaultTenant = window.clusterConfig.defaultTenant || '';
  const tenantsUIDs = tenantsString.split(' ');
  const tenants = tenantsUIDs.map(tenantUId => {
    return {
      label: tenantUId === defaultTenant ? 'default' : tenantUId,
      pathValue: tenantUId,
    };
  });
  return tenants;
};

module.exports = {
  getTenants,
};
