import createEncoder from 'json-url';

const PARAMS_KEY = 'console.auth-params';
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

export async function saveAuthParamsIfPresent(location) {
    const params = new URL(location).searchParams.get('auth');
    if (params) {
        const decoded = await encoder.decompress(params);
        const parsed = JSON.parse(decoded);
        const responseParams = getResponseParams(parsed.usePKCE);
        const scope = getScope(parsed.scope);
        localStorage.setItem(PARAMS_KEY, JSON.stringify({...parsed, ...responseParams, ...scope}));
    }
}

export function getAuthParams() {
    return JSON.parse(localStorage.getItem(PARAMS_KEY) || "null");
}

function getScope(customScope) {
  const scope = customScope ? customScope : 'audience:server:client_id:kyma-client audience:server:client_id:console openid email profile groups'
  return {
      scope: scope
  };
}
