const getTenants = () => {
  const tenants = [{
    label: 'Tenant 1',
    pathValue: 'tenant1'
  }, {
    label: 'Tenant 2',
    pathValue: 'tenant2'
  }, {
    label: 'Tenant 3',
    pathValue: 'tenant3'
  }];
  return tenants
}

module.exports = {
  getTenants
}
