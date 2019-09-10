import React from 'react';
import LogTable from './LogTable/LogTable';
import Header from './Header/Header';

export default class Logs extends React.Component {
  state = {
    searchPhrase: '',
    labels: [],
    advancedSettings: {
      query: '',
      resultLimit: 0,
      showPreviousLogs: true,
      showHealthChecks: true,
    },
    recentlySelectedLabels: [],
    sortDirection: 'ascending',
  };

  render() {
    const { searchPhrase, labels, advancedSettings } = this.state;
    return (
      <>
        <Header
          updateFilteringState={this.setState.bind(this)}
          searchPhrase={searchPhrase}
          labels={labels}
          advancedSettings={advancedSettings}
        />
        <LogTable />
      </>
    );
  }
}
