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
        return { responseType: 'token id_token' };
    }
}

export async function saveAuthParamsIfPresent(location) {
    const params = new URL(location).searchParams.get('auth');
    if (params) {
        const decoded = await encoder.decompress(params);
        const parsed = JSON.parse(decoded);
        const responseParams = getResponseParams(parsed.usePKCE);
        localStorage.setItem(PARAMS_KEY, JSON.stringify({...parsed, ...responseParams}));
    }
}

export function getAuthParams() {
    return JSON.parse(localStorage.getItem(PARAMS_KEY) || "null");
}
