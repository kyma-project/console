import { appInitializer } from '@kyma-project/common';
import createUseContext from 'constate';

import httpConfig from '../store/httpConfig';
import { SORT_ASCENDING } from '../constants';

function getTimestamp(date) {
  return `${date.valueOf()}+000000`;
}

export const useHttpService = createUseContext(() => {
  const getPeriod = period => {
    const endDate = new Date();
    const end = getTimestamp(endDate);

    const milisecondsPerMinute = 60000;
    let minutes;
    switch (period) {
      case 'last minute':
        minutes = 1;
      case 'last 5 minutes':
        minutes = 5;
      case 'last hour':
        minutes = 60;
      default:
        minutes = 15;
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
    return data.values;
  };

  // advancedSettings: {
  //   query: '',
  //   showPreviousLogs: true,
  //   showHealthChecks: true,
  // },

  const fetchLogs = async params => {
    const {
      searchPhrase,
      labels,
      resultLimit,
      logsPeriod,
      sortDirection,
    } = params;

    let direction = 'backward';
    if (sortDirection == SORT_ASCENDING) {
      direction = 'forward';
    }

    let limit = 1000;
    if (resultLimit && resultLimit > 0) {
      limit = resultLimit;
    }

    const { start, end } = getPeriod(logsPeriod);

    // ?query={function="blaa"}

    const queryParams = encodeURIComponent();
    const url = `${httpConfig.queryEndpoint}?query=${queryParams}`;
    const response = await authorizedFetch(url);
    console.log(await response.json());
  };

  return {
    getLabels,
    fetchLogs,
  };
});
