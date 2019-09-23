import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import CompactHeader from '../CompactHeader/CompactHeader';
import LogTable from '../LogTable/LogTable';
import searchParamsReducer, {
  SET_LABELS,
  SET_SHOW_PREVIOUS_LOGS, SET_SEARCH_PHRASE,
  ADD_LABEL, SET_QUERY, SET_RESULT_LIMIT,
  SET_SHOW_ISTIO_LOGS, SET_SHOW_HEALTH_CHECKS,
  SET_AUTO_REFRESH, SET_LOGS_PERIOD, SET_SORT_DIR,
  SearchParamsContext
} from './SearchParams.reducer'
// import 'core-js/es/array/flat-map'; todo


import {
  SORT_ASCENDING,
  DEFAULT_PERIOD,
  LOG_REFRESH_INTERVAL,
} from './../../constants';

function sortLogs(entry1, entry2, sortDirection) {
  const positiveReturn = sortDirection === 'ascending' ? 1 : -1;
  const date1 = new Date(entry1.timestamp);
  const date2 = new Date(entry2.timestamp);
  return date1.getTime() > date2.getTime()
    ? positiveReturn
    : -1 * positiveReturn;
}

const Logs = ({ readonlyLabels, isCompact, httpService }) => {
  const defaultSearchParams = {
    searchPhrase: '',
    labels: [],
    readonlyLabels: readonlyLabels,
    logsPeriod: DEFAULT_PERIOD,
    query: '',
    resultLimit: 1000,
    showPreviousLogs: true,
    showHealthChecks: true,
    showIstioLogs: false,
    sortDirection: SORT_ASCENDING,
    logs: [],
    autoRefreshEnabled: true,
  };

  const [searchParams, dispatch] = useReducer(searchParamsReducer, defaultSearchParams);

  const [intervalId, setIntervalId] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const { autoRefreshEnabled } = searchParams;
    if (intervalId) {
      clearInterval(intervalId)
    }

    if (autoRefreshEnabled) {
      startAutoRefresh(searchParams)
    }

    if (!autoRefreshEnabled && intervalId) {
      setIntervalId(null)
    }
  }, [searchParams])

  const filterHealthChecks = entry => {
    const { showHealthChecks } = searchParams;
    return showHealthChecks || !~entry.log.indexOf('GET /healthz');
  };

  async function fetchLogs(state) {
    const {
      searchPhrase,
      labels,
      readonlyLabels,
      sortDirection,
      logsPeriod,
      resultLimit,
      showPreviousLogs,
      showHealthChecks,
      showIstioLogs,
    } = state;

    if (!labels.length && !readonlyLabels.length && !searchPhrase) {
      return;
    }

    try {
      const result = await httpService.fetchLogs({
        searchPhrase,
        labels: [...readonlyLabels, labels],
        resultLimit,
        logsPeriod,
        sortDirection,
        showPreviousLogs,
        showHealthChecks,
      });
      console.log('fetchLogs')

      let streams = result.streams || [];

      if (!showIstioLogs) {
        streams = [...streams].filter(
          s => !~s.labels.indexOf('container_name="istio-proxy"'),
        );
      }
      const logs = streams
        .flatMap(stream => stream.entries)
        .map(l => ({
          timestamp: l.ts,
          log: l.line,
        }))
        .sort((e1, e2) => sortLogs(e1, e2, sortDirection));

      setLogs(logs)
    } catch (e) {
      console.warn(e); // todo add error message
    }
  };

  function startAutoRefresh(state) {
    fetchLogs(state);
    setIntervalId(setInterval(() => fetchLogs(state), LOG_REFRESH_INTERVAL))
  }
  const actions = {
    addLabel: label => dispatch({ type: ADD_LABEL, value: label }),
    setLabels: labels => dispatch({ type: SET_LABELS, value: labels }),
    setShowPreviousLogs: show => dispatch({ type: SET_SHOW_PREVIOUS_LOGS, value: show }),
    setShowHealthChecks: show => dispatch({ type: SET_SHOW_HEALTH_CHECKS, value: show }),
    setShowIstioLogs: show => dispatch({ type: SET_SHOW_ISTIO_LOGS, value: show }),
    setSearchPhrase: phrase => dispatch({ type: SET_SEARCH_PHRASE, value: phrase }),
    setQuery: query => dispatch({ type: SET_QUERY, value: query }),
    setResultLimit: limit => dispatch({ type: SET_RESULT_LIMIT, value: limit }),
    setAutoRefresh: isRefreshEnabled => dispatch({ type: SET_AUTO_REFRESH, value: isRefreshEnabled }),
    setLogsPeriod: period => dispatch({ type: SET_LOGS_PERIOD, value: period }),
    setSortDir: dir => dispatch({ type: SET_SORT_DIR, value: dir })
  };

  return (

    <SearchParamsContext.Provider value={[searchParams, actions]}>
      {isCompact ? (
        // <CompactHeader
        //   updateFilteringState={this.updateState}
        //   searchPhrase={searchPhrase}
        //   logsPeriod={logsPeriod}
        //   sortDirection={sortDirection}
        //   advancedSettings={advancedSettings}
        //   autoRefreshEnabled={autoRefreshEnabled}
        // />
        null
      ) : (
          <Header />
        )}

      <LogTable entries={logs.filter(filterHealthChecks)} />
    </SearchParamsContext.Provider>
  );

}

export default Logs;