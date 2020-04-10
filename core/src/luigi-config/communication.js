import { relogin, getToken } from './navigation/navigation-helpers';
const NODE_PARAM_PREFIX = `~`;
export const communication = {
  customMessagesListeners: {
    'console.refreshNavigation': () => {
      const token = getToken();
      if (token) {
        Luigi.configChanged('navigation.nodes');
      } else {
        relogin();
      }
    },
    'console.silentNavigate': ({ newParams }) => {
      const { search, pathname } = new URL(window.location.href);
      console.log(newParams);
      let currentParams = {};
      search
        .replace('?', '') // "~a=b&~c=d"
        .split('&') // ["~a=b","~a=b"]
        .forEach(p => {
          const [key, val] = p.replace(NODE_PARAM_PREFIX, '').split('=');
          currentParams[key] = val;
        });

      const newParamsString = converToURLsearch({
        ...currentParams,
        ...newParams
      });

      window.history.replaceState(null, 'sdgsdg', pathname + newParamsString);
    }
  }
};

const converToURLsearch = params => {
  const a = Object.keys(params).map(
    k => NODE_PARAM_PREFIX + k + '=' + params[k]
  );
  return '?' + a.join('&');
};
