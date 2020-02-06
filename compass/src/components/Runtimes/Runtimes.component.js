import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import {
  PageHeader,
  GenericList,
  EMPTY_TEXT_PLACEHOLDER,
  StatusBadge,
} from 'react-shared';
import ScenariosDisplay from './../Shared/ScenariosDisplay/ScenariosDisplay';

class Runtimes extends React.Component {
  static propTypes = {
    runtimes: PropTypes.object.isRequired,
    unregisterRuntime: PropTypes.func.isRequired,
  };

  headerRenderer = () => ['Name', 'Description', 'Scenarios', 'Status'];

  rowRenderer = runtime => [
    <span
      className="link"
      onClick={() =>
        LuigiClient.linkManager().navigate(`details/${runtime.id}`)
      }
    >
      {runtime.name}
    </span>,
    runtime.description ? runtime.description : EMPTY_TEXT_PLACEHOLDER,
    <ScenariosDisplay scenarios={runtime.labels.scenarios || []} />,
    <StatusBadge
      status={
        runtime.status && runtime.status.condition
          ? runtime.status.condition
          : 'UNKNOWN'
      }
    />,
  ];

  render() {
    const runtimesQuery = this.props.runtimes;

    const runtimes =
      (runtimesQuery.runtimes && runtimesQuery.runtimes.data) || {};
    const loading = runtimesQuery.loading;
    const error = runtimesQuery.error;

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
      <>
        <PageHeader title="Runtimes" />
        <GenericList
          entries={runtimes}
          headerRenderer={this.headerRenderer}
          rowRenderer={this.rowRenderer}
        />
      </>
    );
  }
}

export default Runtimes;
