import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header/Header';
import CompactHeader from './CompactHeader/CompactHeader';
import LogTable from './LogTable/LogTable';
// import 'core-js/es/array/flat-map'; todo

import {
  SORT_ASCENDING,
  DEFAULT_PERIOD,
  //LOG_REFRESH_INTERVAL,
} from './../constants';

const SAMPLE_LOGS = [
  {
    timestamp: '14:14:21.384196009Z',
    log: `[2019-06-11 11:58:00.047][15][warning][misc] [external/envoy/source/common/protobuf/utility.cc:174] 
  Using deprecated option 'envoy.1api.v2.Listener.use_original_dst' from file lds.proto. This configuration will be removed from 
  Envoy soon. Please see https://www.envoyproxy.io/docs/envoy/latest/intro/deprecated for details.`,
  },
  {
    timestamp: '14:14:01.384196009Z',
    log: `[2019-06-11 11:58:00.047][15][warning][misc] [external/envoy/source/common/protobuf/utility.cc:174] 
  Using deprecated option 'envoy.api.v2.Listener.use_original_dst' from file lds.proto. This configuration will be removed from 
  Envoy soon. Please see https://www.envoyproxy.io/docs/envoy/latest/intro/deprecated for details.`,
  },
  {
    timestamp: '14:14:31.384196009Z',
    log: `[2019-06-11 11:58:00.047][15][warning][misc] [external/envoy/source/common/protobuf/utility.cc:174] 
  Using deprecated option 'envoy.api.v2. details.`,
  },
  {
    timestamp: '14:14:41.384196009Z',
    log: `log`,
  },
  {
    timestamp: '14:14:51.384196009Z',
    log: `[2019-06-11 11:58:00.0147][15][warning][misc] [external/envoy/source/common/protobuf/utility.cc:174] 
  Using deprecated option 'envoy.api.v2.Listener.use_original_dst' from file lds.proto. This configuration will be removed from 
  Envoy soon. Please see https://www.envoyproxy.io/docs/envoy/latest/intro/deprecated for details.`,
  },
];

export default class Logs extends React.Component {
  static propTypes = {
    httpService: PropTypes.object.isRequired,
    queryTransformService: PropTypes.object.isRequired,
    isLambda: PropTypes.bool,
    readonlyLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
    lambdaName: PropTypes.string,
  };

  static defaultProps = {
    isLambda: false,
    readonlyLabels: [],
    lambdaName: null,
  };

  state = {
    compact: this.props.isLambda,
    searchPhrase: '',
    labels: [],
    readonlyLabels: this.props.readonlyLabels,
    logsPeriod: DEFAULT_PERIOD,
    advancedSettings: {
      query: '',
      resultLimit: 100,
      showPreviousLogs: true,
      showHealthChecks: true,
    },
    sortDirection: SORT_ASCENDING,
    logs: SAMPLE_LOGS,
  };
  intervalId = null;

  componentDidMount = () => {
    const { labels, searchPhrase } = this.state;
    this.setState({
      advancedSettings: {
        ...this.state.advancedSettings,
        query: this.props.queryTransformService.toQuery(labels, searchPhrase),
      },
    });
    //this.intervalId = setInterval(this.fetchLogs, LOG_REFRESH_INTERVAL);
  };

  componentWillUnmount = () => {
    //clearInterval(this.intervalId);
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
    } = advancedSettings;

    try {
      const res = await this.props.httpService.fetchLogs({
        searchPhrase,
        labels: [...readonlyLabels, labels],
        resultLimit,
        logsPeriod,
        sortDirection,
        showPreviousLogs,
        showHealthChecks,
      });
      const logs = res.streams
        ? res.streams
            .flatMap(stream => stream.entries)
            .map(l => ({
              timestamp: l.ts,
              log: l.line,
            }))
        : [];
      this.setState({ logs });
    } catch (e) {
      console.warn(e);
    }
  };

  filterHealthChecks = entry => {
    const showHealthChecks = this.state.advancedSettings.showHealthChecks;
    return showHealthChecks || entry.log.indexOf('GET /healthz') < 0;
  };

  // intercept setState to update query, labels and searchPhrase
  updateState = partialState => {
    const { parseQuery, toQuery } = this.props.queryTransformService;
    const { labels, searchPhrase, query } = this.state;

    let additionalState = {};

    if ('searchPhrase' in partialState) {
      // searchPhrase changed, update query
      additionalState = {
        advancedSettings: {
          ...this.state.advancedSettings,
          query: toQuery(labels, partialState.searchPhrase),
        },
      };
    } else if ('labels' in partialState) {
      // labels changed, update query
      additionalState = {
        advancedSettings: {
          ...this.state.advancedSettings,
          query: toQuery(partialState.labels, searchPhrase),
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
      compact,
      logs,
    } = this.state;

    return (
      <>
        {compact ? (
          <CompactHeader
            updateFilteringState={this.updateState}
            searchPhrase={searchPhrase}
            logsPeriod={logsPeriod}
            sortDirection={sortDirection}
            advancedSettings={advancedSettings}
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
          />
        )}
        <LogTable
          entityName={this.props.lambdaName}
          entries={logs.filter(this.filterHealthChecks)}
        />
      </>
    );
  }
}
