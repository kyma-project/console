const domain = location.hostname.replace(/^console(-dev)?\./, '');
// const isLocalDev = location.hostname.startsWith('console-dev');

// export const config = {
//   domain,
//   localDomain: 'console-dev.' + domain,
//   serviceCatalogModuleUrl: isLocalDev ? 'http://console-dev.'+ domain + ':8000' : 'https://catalog.' + domain,
//   addOnsModuleUrl: isLocalDev ? 'http://console-dev.'+ domain + ':8004' : 'https://addons.' + domain,
//   logsModuleUrl: isLocalDev ? 'http://console-dev.'+ domain + ':8005' : 'https://logs.' + domain,
//   coreUIModuleUrl: isLocalDev ? 'http://console-dev.'+ domain +':8889' : 'https://core-ui.' + domain,
//   pamelaApiUrl: isLocalDev ? 'http://localhost:3001' : 'https://console.' + domain + "/backend",
// };
export const config = {
  domain,
  localDomain: 'console-dev.' + domain,
  serviceCatalogModuleUrl: location.origin + '/catalog',
  addOnsModuleUrl: location.origin + '/addons',
  logsModuleUrl: location.origin + '/logs',
  coreUIModuleUrl: location.origin + '/core-ui',
  pamelaApiUrl: location.origin + '/backend',
};