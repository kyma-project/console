import React from 'react';
import PropTypes from 'prop-types';
import LogTable from './LogTable/LogTable';
import LuigiClient from '@kyma-project/luigi-client';
import Header from './Header/Header';
import CompactHeader from './CompactHeader/CompactHeader';

import { QueryTransformServiceContext } from '../services/queryTransformService';
import { HttpServiceContext } from '../services/httpService';
import { SORT_ASCENDING, DEFAULT_PERIOD } from './../constants';

class Logs extends React.Component {
  static propTypes = {
    httpService: PropTypes.object.isRequired,
    queryService: PropTypes.object.isRequired,
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
      resultLimit: 0,
      showPreviousLogs: true,
      showHealthChecks: true,
    },
    sortDirection: SORT_ASCENDING,
  };

  componentDidMount() {
    console.log(this.props);
    const { toQuery } = this.props.queryTransformService;
    const { labels, searchPhrase } = this.state;

    this.setState({
      advancedSettings: {
        ...this.state.advancedSettings,
        query: toQuery(labels, searchPhrase),
      },
    });
  }

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

  // intercept setState to update query, labels and searchPhrase
  updateState = partialState => {
    const { parseQuery, toQuery } = this.queryTransformService;
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
    } = this.state;
    return (
      <>
        <button
          onClick={async () => {
            const fetchLogs = this.props.httpService;
            const {
              searchPhrase,
              labels,
              readonlyLabels,
              advancedSettings,
            } = this.state;
            const {
              logsPeriod,
              resultLimit,
              showPreviousLogs,
              showHealthChecks,
            } = advancedSettings;
            console.log(
              await fetchLogs({
                searchPhrase,
                labels: [...readonlyLabels, labels],
                resultLimit,
                logsPeriod,
                sortDirection,
                showPreviousLogs,
                showHealthChecks,
              }),
            );
          }}
        >
          DAWAJ
        </button>
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
        {/* <LogTable entries={sampleEntries} /> */}
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
