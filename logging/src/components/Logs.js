import React from 'react';
import LogTable from './LogTable/LogTable';
import Header from './Header/Header';

const sampleLabels = ['function="pamela"', 'function="hasselhoff"'];
const sampleReadonlyLabels = ['function="rpamela"', 'function="rhasselhoff"'];

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
        <LogTable />
      </>
    );
  }
}
