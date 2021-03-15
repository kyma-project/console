const domain = location.hostname.replace(/^console(-dev)?\./, '');
const isNpx = location.origin === 'http://localhost:3001';
const isLocalDev =
  location.hostname.startsWith('console-dev') ||
  location.hostname.startsWith('localhost');
const localDomain = location.hostname.startsWith('console-dev')
  ? 'http://console-dev.' + domain
  : 'http://localhost';

export let config;

if (isNpx) {
  config = {
    domain,
    isNpx,
    localDomain: 'console-dev.' + domain,
    serviceCatalogModuleUrl: location.origin + '/catalog',
    addOnsModuleUrl: location.origin + '/addons',
    logsModuleUrl: location.origin + '/logs',
    coreUIModuleUrl: location.origin + '/core-ui',
    pamelaApiUrl: location.origin + '/backend',
  };
} else {
  config = {
    domain,
    isNpx,
    localDomain,
    serviceCatalogModuleUrl: isLocalDev
      ? localDomain + ':8000'
      : 'https://catalog.' + domain,
    addOnsModuleUrl: isLocalDev
      ? localDomain + ':8004'
      : 'https://addons.' + domain,
    logsModuleUrl: isLocalDev
      ? localDomain + ':8005'
      : 'https://logs.' + domain,
    coreUIModuleUrl: isLocalDev
      ? localDomain + ':8889'
      : 'https://core-ui.' + domain,
    pamelaApiUrl: isLocalDev
      ? 'http://localhost:3001'
      : 'https://console.' + domain + '/backend',
  };
}
