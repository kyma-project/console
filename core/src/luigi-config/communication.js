import { relogin, getToken } from './navigation/navigation-helpers';
import { NODE_PARAM_PREFIX } from './luigi-config';
import { config } from './config';
import { saveInitParams, getInitParams } from './init-params';

export const communication = {
  customMessagesListeners: {
    'console.showSystemNamespaces': ({ showSystemNamespaces }) => {
      localStorage.setItem(
        'console.showSystemNamespaces',
        showSystemNamespaces
      );
      if (showSystemNamespaces) {
        Luigi.featureToggles().setFeatureToggle('showSystemNamespaces');
      } else {
        Luigi.featureToggles().unsetFeatureToggle('showSystemNamespaces');
      }
    },
    'console.showExperimentalViews': ({ showExperimentalViews }) => {
      localStorage.setItem(
        'console.showExperimentalViews',
        showExperimentalViews
      );
    },
    'console.updateInitParams': (modifiedParams) => {
      const params = getInitParams();
      delete modifiedParams.id;
      saveInitParams({ ...params, ...modifiedParams });
      location.reload();
    },
    'console.refreshNavigation': () => {
      const token = getToken();
      if (token) {
        Luigi.configChanged('navigation.nodes');
      } else {
        relogin();
      }
    },
    'console.setWindowTitle': ({ title }) => {
      const luigiConfig = Luigi.getConfig();
      luigiConfig.settings.header.title = `Kyma - ${title}`;
      Luigi.configChanged('settings.header');
    },
    'console.silentNavigate': ({ newParams }) => {
      const { search: paramsString, pathname } = new URL(window.location.href);
      const currentParams = convertToObject(paramsString);

      // remove params explicitly marked for removal
      Object.keys(newParams).forEach((key) => {
        if (newParams[key] === undefined) {
          delete currentParams[key];
          delete newParams[key];
        }
      });

      const newParamsString = convertToURLsearch({
        ...currentParams,
        ...newParams,
      });

      window.history.replaceState(
        null,
        window.document.title,
        pathname + newParamsString
      );
    },
  },
};

const convertToURLsearch = (params) => {
  const a = Object.keys(params).map(
    (k) => NODE_PARAM_PREFIX + k + '=' + params[k]
  );
  return '?' + a.join('&');
};

const convertToObject = (paramsString) => {
  let result = {};
  paramsString
    .replace('?', '')
    .split('&')
    .forEach((p) => {
      const [key, val] = p.replace(NODE_PARAM_PREFIX, '').split('=');
      if (key) result[key] = val;
    });
  return result;
};
