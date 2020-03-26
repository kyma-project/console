import settings from './settings';
import navigation from './navigation';
import createAuth from './auth';

async function fetchDexMetadata() {
  const domain =
    (window.clusterConfig && window.clusterConfig['domain']) || 'pijany.hasselhoff.ga';

  try {
    const response = await fetch(`https://dex.${domain}/.well-known/openid-configuration`);
    return await response.json();
  }
  catch (e) {
    alert('Cannot fetch dex metadata');
    console.error('cannot fetch dex metadata', e);
  }
}


(async () => {
  const dexMetadata = await fetchDexMetadata();
  
  Luigi.setConfig({
    navigation,
    auth: createAuth(dexMetadata),
    routing: {
      useHashRouting: false,
    },
    settings,
  });
})();
