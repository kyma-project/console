import { appInitializer } from '@kyma-project/common';
import createUseContext from 'constate';

import httpConfig from '../store/httpConfig';
import { SORT_ASCENDING } from '../constants';

function getTimestamp(date) {
  return `${date.valueOf()}000000`;
}

const useHttpService = createUseContext(() => {
  const getPeriod = period => {
    const endDate = new Date();
    const end = getTimestamp(endDate);

    const milisecondsPerMinute = 60000;
    let minutes;
    switch (period) {
      case 'last minute':
        minutes = 1;
        break;
      case 'last 5 minutes':
        minutes = 5;
        break;
      case 'last hour':
        minutes = 60;
        break;
      default:
        minutes = 15;
        break;
    }
    const startDate = new Date(endDate - milisecondsPerMinute * minutes);
    const start = getTimestamp(startDate);

    return { start, end };
  };

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
    return data.values || [];
  };

  // advancedSettings: {
  //   query: '',
  //   showPreviousLogs: true,
  //   showHealthChecks: true,
  // },

  const fetchLogs = async params => {
    console.log(params);
    const {
      searchPhrase,
      labels,
      resultLimit,
      logsPeriod,
      sortDirection,
      showPreviousLogs,
      showHealthChecks,
    } = params;

    let direction = 'backward';
    if (sortDirection === SORT_ASCENDING) {
      direction = 'forward';
    }

    let limit = 0;
    if (resultLimit && resultLimit > 0) {
      limit = resultLimit;
    }

    const { start, end } = getPeriod(logsPeriod);

    const query = `{${labels}} ${searchPhrase.trim()}`;

    const encodedQuery = encodeURIComponent(query);
    const url = `${httpConfig.queryEndpoint}?query=${encodedQuery}&start=${start}&end=${end}&direction=${direction}&limit=${limit}`;
    console.log(url);

    const response = await authorizedFetch(url);
    if (response.status === 200) {
      return await response.json();
    } else {
      return await response.text();
    }
  };

  return {
    getLabels,
    fetchLogs,
  };
});

const { Provider, Context } = useHttpService;
export { Provider as HttpServiceProvider, Context as HttpServiceContext };
