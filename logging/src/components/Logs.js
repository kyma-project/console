import React from 'react';
import LogTable from './LogTable/LogTable';
import Header from './Header/Header';

const sampleLabels = ['function="pamela"', 'function="hasselhoff"'];
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
  //   searchPhrase: '',
  //   labels: [],
  //   readonlyLabels: [],
  //   advancedSettings: {
  //     query: '',
  //     resultLimit: 0,
  //     showPreviousLogs: true,
  //     showHealthChecks: true,
  //   },
  //   recentlySelectedLabels: [],
  //   sortDirection: 'ascending',
  // };
  state = {
    searchPhrase: '',
    labels: sampleLabels,
    readonlyLabels: sampleReadonlyLabels,
    advancedSettings: {
      query: '',
      resultLimit: 0,
      showPreviousLogs: true,
      showHealthChecks: true,
    },
    sortDirection: 'ascending',
  };

  render() {
    const {
      searchPhrase,
      labels,
      readonlyLabels,
      sortDirection,
      advancedSettings,
    } = this.state;
    return (
      <>
        <Header
          updateFilteringState={this.setState.bind(this)}
          searchPhrase={searchPhrase}
          labels={labels}
          sortDirection={sortDirection}
          readonlyLabels={readonlyLabels}
          advancedSettings={advancedSettings}
        />
        <LogTable entries={sampleEntries} />
      </>
    );
  }
}
