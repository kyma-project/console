import React, {createContext, useContext} from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import CompactHeader from '../CompactHeader/CompactHeader';
import LogTable from '../LogTable/LogTable';
import reducer, {SET_LABELS, SET_SHOW_PREVIOUS_LOGS} from './Logs.reducer'
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

export default class Logs extends React.Component {
  static propTypes = {
    httpService: PropTypes.object.isRequired,
    queryTransformService: PropTypes.object.isRequired,
    podsSubscriptionService: PropTypes.object.isRequired,

    isCompact: PropTypes.bool,
    readonlyLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
  };

  static defaultProps = {
    isLambda: false,
    readonlyLabels: [],
  };

  state = {
    searchPhrase: '',
    labels: [],
    readonlyLabels: this.props.readonlyLabels,
    logsPeriod: DEFAULT_PERIOD,
    advancedSettings: {
      query: '',
      resultLimit: 1000,
      showPreviousLogs: true,
      showHealthChecks: true,
      showIstioLogs: false,
    },
    sortDirection: SORT_ASCENDING,
    logs: [],
    autoRefreshEnabled: true,
  };
  intervalId = null;

  componentDidMount = () => {
    const [state, dispatch] = useReducer(reducer, {});
    const { labels } = this.state;
    this.setState({
      advancedSettings: {
        ...this.state.advancedSettings,
        query: this.props.queryTransformService.toQuery(labels),
      },
    });

    if (this.state.autoRefreshEnabled) {
      this.startAutoRefresh();
    }
  };

  componentWillUnmount = () => {
    clearInterval(this.intervalId);
  };

  fetchLogs = async () => {
    const {
      searchPhrase,
      labels,
      readonlyLabels,
      advancedSettings,
      sortDirection,
      logsPeriod,
    } = this.state;

    if (!labels.length && !readonlyLabels.length && !searchPhrase) {
      return;
    }

    const {
      resultLimit,
      showPreviousLogs,
      showHealthChecks,
      showIstioLogs,
    } = advancedSettings;

    try {
      const result = await this.props.httpService.fetchLogs({
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

      this.setState({ logs });
    } catch (e) {
      console.warn(e); // todo add error message
    }
  };

  filterHealthChecks = entry => {
    const showHealthChecks = this.state.advancedSettings.showHealthChecks;
    return showHealthChecks || !~entry.log.indexOf('GET /healthz');
  };

  startAutoRefresh() {
    this.fetchLogs();
    this.intervalId = setInterval(this.fetchLogs, LOG_REFRESH_INTERVAL);
  }

  // intercept setState
  updateState = partialState => {
    const { parseQuery, toQuery } = this.props.queryTransformService;
    const { query } = this.state;

    let additionalState = {};

    if ('labels' in partialState) {
      // labels changed, update query
      additionalState = {
        advancedSettings: {
          ...this.state.advancedSettings,
          query: toQuery(partialState.labels),
        },
      };
    } else if (
      'advancedSettings' in partialState &&
      partialState.advancedSettings.query !== query
    ) {
      // query changed, update searchPhrase and labels
      additionalState = {
        ...this.state.advancedSettings,
        ...parseQuery(partialState.advancedSettings.query),
      };
    }

    if ('autoRefreshEnabled' in partialState) {
      if (partialState.autoRefreshEnabled) {
        this.startAutoRefresh();
      } else {
        clearInterval(this.intervalId);
      }
    }

    this.setState({ ...partialState, ...additionalState });
  };

  render() {
    const {
      searchPhrase,
      labels,
      readonlyLabels,
      logsPeriod,
      sortDirection,
      advancedSettings,
      autoRefreshEnabled,
      logs,
    } = this.state;
    const { isCompact } = this.props;

    const actions = {
      setLabels: (labels) => ({type: SET_LABELS, value: labels}),
      setShowPreviousLogs: (show) => ({type: SET_SHOW_PREVIOUS_LOGS, value: show})
    };

    return (
      <LogsContext.Provider value={[state, actions]}>
        {isCompact ? (
          <CompactHeader
            updateFilteringState={this.updateState}
            searchPhrase={searchPhrase}
            logsPeriod={logsPeriod}
            sortDirection={sortDirection}
            advancedSettings={advancedSettings}
            autoRefreshEnabled={autoRefreshEnabled}
          />
        ) : (
          <Header
            updateFilteringState={this.updateState}
            searchPhrase={searchPhrase}
            labels={labels}
            readonlyLabels={readonlyLabels}
            logsPeriod={logsPeriod}
            sortDirection={sortDirection}
            advancedSettings={advancedSettings}
            autoRefreshEnabled={autoRefreshEnabled}
          />
        )}
        <LogTable entries={logs.filter(this.filterHealthChecks)} />
      </LogsContext.Provider>
    );
  }
}
