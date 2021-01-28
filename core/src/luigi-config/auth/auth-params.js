const PARAMS_KEY = 'console.auth-params';

function inferResponseData(usePKCE = true) {
    if (usePKCE) {
        return {
            responseType: 'code',
            responseMode: 'query',
        };
    } else {
        return { responseType: 'token id_token' };
    }
}

export function saveAuthParamsIfPresent(location) {
    const params = new URL(location).searchParams.get('auth');
    if (params) {
        const parsed = JSON.parse(params);
        const responseData = inferResponseData(parsed.usePKCE);
        localStorage.setItem(PARAMS_KEY, JSON.stringify({...parsed, ...responseData}));
    }
}

export function getAuthParams() {
    return JSON.parse(localStorage.getItem(PARAMS_KEY) || "null");
}
