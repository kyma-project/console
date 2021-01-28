const PARAMS_KEY = 'console.auth-params';

export function saveAuthParamsIfPresent(location) {
    const params = new URL(location).searchParams.get('auth');
    if (params) {
        // no need to stringify
        localStorage.setItem(PARAMS_KEY, params);
    }
}

export function getAuthParams() {
    return JSON.parse(localStorage.getItem(PARAMS_KEY) || "{}");
}

export function inferResponseData(usePKCE) {
    if (usePKCE) {
        return {
            responseType: 'code',
            responseMode: 'query',
        };
    } else {
        return {
            responseType: 'token id_token',
        };
    }
}