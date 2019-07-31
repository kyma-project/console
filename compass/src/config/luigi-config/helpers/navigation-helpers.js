const getTenants = () => {
  const tenantsString = window.clusterConfig.tenants || "";
  const tenantsUIDs = tenantsString.split(" ")
  const tenants = tenantsUIDs.map(tenantUId => {
    return {
      label: tenantUId,
      pathValue: tenantUId,
    };
  });
  return tenants;
};

module.exports = {
  getTenants,
};
