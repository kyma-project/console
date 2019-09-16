import React from 'react';
import PropTypes from 'prop-types';
import LogTable from './LogTable/LogTable';
import LuigiClient from '@kyma-project/luigi-client';
import Header from './Header/Header';
import CompactHeader from './CompactHeader/CompactHeader';
// import 'core-js/es/array/flat-map'; todo

import { QueryTransformServiceContext } from '../services/queryTransformService';
import { HttpServiceContext } from '../services/httpService';
import {
  SORT_ASCENDING,
  DEFAULT_PERIOD,
  LOG_REFRESH_INTERVAL,
} from './../constants';

class Logs extends React.Component {
  static propTypes = {
    httpService: PropTypes.object.isRequired,
    queryTransformService: PropTypes.object.isRequired,
  };

  todo_is_lambda() {
    var params = LuigiClient.getNodeParams();
    return !!params.function;
  }

  state = {
    compact: this.todo_is_lambda(),
    searchPhrase: '',
    labels: [],
    readonlyLabels: this.tryGetReadonlyLabels() || [],
    logsPeriod: DEFAULT_PERIOD,
    advancedSettings: {
      query: '',
      resultLimit: 100,
      showPreviousLogs: true,
      showHealthChecks: true,
    },
    sortDirection: SORT_ASCENDING,
    logs: [],
  };
  intervalId = null;

  componentDidMount = () => {
    const { toQuery } = this.props.queryTransformService;
    const { labels, searchPhrase } = this.state;

    this.setState({
      advancedSettings: {
        ...this.state.advancedSettings,
        query: toQuery(labels, searchPhrase),
      },
    });

    //this.intervalId = setInterval(this.fetchLogs, LOG_REFRESH_INTERVAL);
  };

  componentWillUnmount = () => {
    //clearInterval(this.intervalId);
  };

  tryGetReadonlyLabels() {
    const params = LuigiClient.getNodeParams();
    if (params.function && params.namespace) {
      return [
        `function="${params.function}"`,
        `namespace="${params.namespace}"`,
      ];
    }
    return null;
  }

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

    const { fetchLogs } = this.props.httpService;
    try {
      const res = await fetchLogs({
        searchPhrase,
        labels: [...readonlyLabels, labels],
        resultLimit,
        logsPeriod,
        sortDirection,
        showPreviousLogs,
        showHealthChecks,
      });
      const logs = res.streams.flatMap(stream => stream.entries);
      this.setState({ logs });
    } catch (e) {
      console.log(e);
    }
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
          query: toQuery(labels, partialState.searchPhrase),
        },
      };
    } else if ('labels' in partialState) {
      // labels changed, update query
      additionalState = {
        advancedSettings: {
          query: toQuery(partialState.labels, searchPhrase),
        },
      };
    } else if (
      // query changed, update searchPhrase and labels
      'advancedSettings' in partialState &&
      partialState.advancedSettings.query !== query
    ) {
      additionalState = parseQuery(partialState.advancedSettings.query);
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
        <LogTable entries={logs} />
      </>
    );
  }
}

export default function LogsContainer() {
  const httpService = React.useContext(HttpServiceContext);
  const queryTransformService = React.useContext(QueryTransformServiceContext);

  return (
    <Logs
      httpService={httpService}
      queryTransformService={queryTransformService}
    />
  );
}
