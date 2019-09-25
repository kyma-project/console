import React, { useReducer, useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import CompactHeader from '../CompactHeader/CompactHeader';
import LogTable from '../LogTable/LogTable';
import searchParamsReducer, {
  actions,
  SearchParamsContext,
  defaultSearchParams,
} from './SearchParams.reducer';
import './Logs.scss'
// import 'core-js/es/array/flat-map'; todo

import { LOG_REFRESH_INTERVAL } from './../../constants';

function sortLogs(entry1, entry2, sortDirection) {
  const positiveReturn = sortDirection === 'ascending' ? 1 : -1;
  const date1 = Date.parse(entry1.timestamp);
  const date2 = Date.parse(entry2.timestamp);
  return date1 > date2
    ? positiveReturn
    : -1 * positiveReturn;
}

export const LambdaNameContext = createContext(null);
export const useLambdaName = () => React.useContext(LambdaNameContext);

const Logs = ({ readonlyLabels, isCompact, httpService }) => {
  const [searchParams, dispatch] = useReducer(searchParamsReducer, {
    ...defaultSearchParams,
    readonlyLabels,
  });

  const [intervalId, setIntervalId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [lambdaName, setLambdaName] = useState(null); // for local usage to connect useEffect() and lambdaNameContext

  useEffect(() => {
    const { autoRefreshEnabled } = searchParams;
    if (intervalId) {
      clearInterval(intervalId);
    }

    if (autoRefreshEnabled) {
      startAutoRefresh(searchParams);
    }

    if (!autoRefreshEnabled && intervalId) {
      setIntervalId(null);
    }
    //TODO 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const allLabels = [...searchParams.labels, ...searchParams.readonlyLabels];
    const functionLabel = allLabels.find(l => ~l.indexOf('function='));

    if (!functionLabel) {
      setLambdaName(null);
      return;
    }

    const lambdaName = functionLabel.split('=')[1];
    setLambdaName(lambdaName);
  }, [searchParams.labels, searchParams.readonlyLabels]);

  const filterHealthChecks = entry => {
    const { showHealthChecks } = searchParams;
    return showHealthChecks || !~entry.log.indexOf('::ffff:127.0.0.1');
  };

  async function fetchLogs() {
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
    } = searchParams;

    if (!labels.length && !readonlyLabels.length) {
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

      setLogs(logs);
    } catch (e) {
      console.warn(e); // todo add error message
    }
  }

  async function startAutoRefresh() {
    fetchLogs();
    setIntervalId(setInterval(fetchLogs, LOG_REFRESH_INTERVAL));
  }

  return (
    <LambdaNameContext.Provider value={lambdaName}>
      <SearchParamsContext.Provider value={[searchParams, actions(dispatch)]}>
        {isCompact ? <CompactHeader /> : <Header />}
        {searchParams.labels.length || searchParams.readonlyLabels.length ? (
          <LogTable entries={logs.filter(filterHealthChecks)} />
        ) : (
            <article className="fd-container fd-container--centered">
              <p className="fd-has-margin-large logs__no-filter">
                Add at least one label to the filter to see the logs.
              </p>
            </article>
          )}
      </SearchParamsContext.Provider>
    </LambdaNameContext.Provider>
  );
};

Logs.propTypes = {
  readonlyLabels: PropTypes.arrayOf(PropTypes.string),
  isCompact: PropTypes.bool,
  httpService: PropTypes.object.isRequired,
};

Logs.defaultProps = {
  readonlyLabels: [],
  isCompact: false,
};

export default Logs;
