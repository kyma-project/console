import createEncoder from 'json-url';

const PARAMS_KEY = 'console.init-params';
const encoder = createEncoder('lzstring');

function getResponseParams(usePKCE = true) {
  if (usePKCE) {
    return {
      responseType: 'code',
      responseMode: 'query',
    };
  } else {
    return { responseType: 'id_token' };
  }
}

function createSystemNamespacesList(namespaces) {
  return namespaces ? namespaces.split(' ') : [];
}

export async function saveInitParamsIfPresent(location) {
  const params = new URL(location).searchParams.get('init');
  if (params) {
    const decoded = await encoder.decompress(params);
    const responseParams = getResponseParams(decoded.usePKCE);
    const systemNamespaces = createSystemNamespacesList(
      decoded.systemNamespaces
    );
    saveInitParams({ ...decoded, ...responseParams, systemNamespaces });
  }
}

export function saveInitParams(params) {
  localStorage.setItem(PARAMS_KEY, JSON.stringify(params));
}

export function getInitParams() {
  return JSON.parse(localStorage.getItem(PARAMS_KEY) || 'null');
}
