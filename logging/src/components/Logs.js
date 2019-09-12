import React from 'react';
import LogTable from './LogTable/LogTable';
import LuigiClient from '@kyma-project/luigi-client';
import Header from './Header/Header';
import CompactHeader from './CompactHeader/CompactHeader';
import { SORT_ASCENDING, DEFAULT_PERIOD } from './../constants';

const sampleLabels = ['function="pamela"'];
const sampleReadonlyLabels = ['function="rpamela"', 'function="rhasselhoff"'];
const sampleEntries = [
  {
    timestamp: '14:14:01.384196009Z',
    log: 'a',
  },
  {
    timestamp: '14:14:01.384196009Z++',
    log: `[2019-06-11 11:58:00.047][15][warning][misc] [external/envoy/source/common/protobuf/utility.cc:174] 
    Using deprecated option 'envoy.api.v2.Listener.use_original_dst' from file lds.proto. This configuration will be removed from 
    Envoy soon. Please see https://www.envoyproxy.io/docs/envoy/latest/intro/deprecated for details.`,
  },
  {
    timestamp: 3,
    log: 'c',
  },
];

export default class Logs extends React.Component {
  // state = {
  //    compact: false,
  //   searchPhrase: '',
  //   labels: [],
  //   readonlyLabels: [],
  //    logsPeriod: DEFAULT_PERIOD,
  //   advancedSettings: {
  //     query: '',
  //     resultLimit: 0,
  //     showPreviousLogs: true,
  //     showHealthChecks: true,
  //   },
  //   recentlySelectedLabels: [],
  //   sortDirection: SORT_ASCENDING,
  // };

  todo_is_lambda() {
    var params = LuigiClient.getNodeParams();
    return !!params.function;
  }

  constructor(props) {
    super(props);

    const readonlyLabels = this.tryGetReadonlyLabels();
    //console.log(readonlyLabels);
    this.state = {
      compact: this.todo_is_lambda(),
      searchPhrase: '',
      labels: sampleLabels,
      readonlyLabels: readonlyLabels || sampleReadonlyLabels,
      logsPeriod: DEFAULT_PERIOD,
      advancedSettings: {
        query: '',
        resultLimit: 0,
        showPreviousLogs: true,
        showHealthChecks: true,
      },
      sortDirection: SORT_ASCENDING,
    };
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
        {compact ? (
          <CompactHeader
            updateFilteringState={this.setState.bind(this)}
            searchPhrase={searchPhrase}
            logsPeriod={logsPeriod}
            sortDirection={sortDirection}
            advancedSettings={advancedSettings}
          />
        ) : (
          <Header
            updateFilteringState={this.setState.bind(this)}
            searchPhrase={searchPhrase}
            labels={labels}
            readonlyLabels={readonlyLabels}
            logsPeriod={logsPeriod}
            sortDirection={sortDirection}
            advancedSettings={advancedSettings}
          />
        )}
        <LogTable entries={sampleEntries} />
      </>
    );
  }
}
