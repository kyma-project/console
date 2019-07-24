import React from 'react';
import PropTypes from 'prop-types';
import { Token } from 'fundamental-react/lib/Token';

import LuigiClient from '@kyma-project/luigi-client';
import GenericList from '../../shared/components/GenericList/GenericList';
import CreateRuntimeForm from './CreateRuntimeForm/CreateRuntimeForm';

class Runtimes extends React.Component {
  static propTypes = {
    runtimes: PropTypes.object.isRequired,
  };

  createLabels = labels => {
    const separatedLabels = [];
    for (const key in labels) {
      if (labels.hasOwnProperty(key) && labels[key].length > 0) {
        labels[key].forEach(lab => {
          if (lab === 'undefined') {
            separatedLabels.push(key);
          } else {
            separatedLabels.push(key + '=' + lab);
          }
        });
      }
    }
    return separatedLabels.map((label, id) => (
      <Token
        key={id}
        className="y-fd-token y-fd-token--no-button y-fd-token--gap"
      >
        {label}
      </Token>
    ));
  };

  headerRenderer = runtimes => [
    'Name',
    'Description',
    'Labels',
  ];

  rowRenderer = runtime => [
    <span
      className="link"
      onClick={() =>
        LuigiClient.linkManager()
          .navigate(`details/${runtime.id}`)
      }
    >
      <b>{runtime.name}</b>
    </span>,
    runtime.description ? runtime.description : '-',
    runtime.labels ? this.createLabels(runtime.labels) : '-',
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
