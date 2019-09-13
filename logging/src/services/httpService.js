import { appInitializer } from '@kyma-project/common';
import createUseContext from 'constate';

import httpConfig from '../store/httpConfig';

export const useHttpService = createUseContext(() => {
  const authorizedFetch = url => {
    return fetch(url, {
      headers: new Headers({
        Authorization: appInitializer.getBearerToken(),
      }),
    });
  };

  const getLabels = async category => {
    const url = httpConfig.resourceLabels(category);
    const response = await authorizedFetch(url);
    const data = await response.json();
    return data.values;
  };

  return {
    getLabels,
  };
});
