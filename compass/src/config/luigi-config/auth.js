const domain =
  (window.clusterConfig && window.clusterConfig['domain']) || 'kyma.local';

const authClusterConfig = window.clusterConfig && window.clusterConfig.auth;

const auth = {
  use: 'openIdConnect',
  openIdConnect: {
    authority: authClusterConfig
      ? authClusterConfig['authority']
      : `https://dex.${domain}`,
    client_id: authClusterConfig
      ? authClusterConfig['client_id']
      : 'compass-ui',
    scope: authClusterConfig
      ? authClusterConfig['scope']
      : 'audience:server:client_id:compass-ui openid profile email groups',
    loadUserInfo: false,
    logoutUrl: '/logout.html',
  },
};

export default auth;
