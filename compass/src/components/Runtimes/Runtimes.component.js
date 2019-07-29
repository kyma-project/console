import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import CreateRuntimeForm from './CreateRuntimeForm/CreateRuntimeForm';
import StatusBadge from '../Shared/StatusBadge/StatusBadge';
import GenericList from '../../shared/components/GenericList/GenericList';
import { EMPTY_TEXT_PLACEHOLDER } from '../../shared/constants';

class Runtimes extends React.Component {
  static propTypes = {
    runtimes: PropTypes.object.isRequired,
  };

  headerRenderer = runtimes => [
    'Name',
    'Description',
    'Assigned Scenarios',
    'Status',
  ];

  rowRenderer = runtime => [
    <span
      className="link"
      onClick={() =>
        LuigiClient.linkManager().navigate(`details/${runtime.id}`)
      }
    >
      <b>{runtime.name}</b>
    </span>,
    runtime.description ? runtime.description : { EMPTY_TEXT_PLACEHOLDER },
    runtime.labels && runtime.labels.scenarios
      ? runtime.labels.scenarios.length
      : 0,
    <StatusBadge
      status={
        runtime.status && runtime.status.condition
          ? runtime.status.condition
          : 'UNKNOWN'
      }
    />,
  ];

  handleDelete = async element => {
    try {
      await this.props.deleteRuntime(element.id);
      this.refreshRuntimes();
    } catch (e) {
      LuigiClient.uxManager().showAlert({
        text: `Error occored during deletion ${e.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  refreshRuntimes = () => {
    this.props.runtimes.refetch();
  };

  actions = [
    {
      name: 'Delete',
      handler: entry => {
        LuigiClient.uxManager()
          .showConfirmationModal({
            header: 'Remove runtime',
            body: `Are you sure you want to delete runtime "${entry.name}"?`,
            buttonConfirm: 'Delete',
            buttonDismiss: 'Cancel',
          })
          .then(() => {
            this.handleDelete(entry);
          })
          .catch(() => {});
      },
    },
  ];

  render() {
    const runtimesQuery = this.props.runtimes;

    const runtimes =
      (runtimesQuery &&
        runtimesQuery.runtimes &&
        runtimesQuery.runtimes.data) ||
      {};
    const loading = runtimesQuery && runtimesQuery.loading;
    const error = runtimesQuery && runtimesQuery.error;

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
      <>
        <CreateRuntimeForm />
        <GenericList
          title="Runtimes"
          description="List of all runtimes"
          actions={this.actions}
          entries={runtimes}
          headerRenderer={this.headerRenderer}
          rowRenderer={this.rowRenderer}
        />
      </>
    );
  }
}

export default Runtimes;
