import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import StatusBadge from '../Shared/StatusBadge/StatusBadge';
import { EMPTY_TEXT_PLACEHOLDER } from '../../shared/constants';
import { handleDelete, GenericList } from 'react-shared';
import ScenariosDisplay from './../Shared/ScenariosDisplay/ScenariosDisplay';

import ModalWithForm from '../../shared/components/ModalWithForm/ModalWithForm.container';
import RegisterRuntimeForm from './RegisterRuntimeForm/RegisterRuntimeForm.container';
import { PageHeader } from 'react-shared';

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

  actions = [
    {
      name: 'Delete',
      handler: entry => {
        handleDelete(
          'Runtime',
          entry.id,
          entry.name,
          this.props.unregisterRuntime,
          this.props.runtimes.refetch,
        );
      },
    },
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
          extraHeaderContent={
            <ModalWithForm
              title="Create new runtime"
              button={{ text: 'Create runtime', option: 'light' }}
              confirmText="Create"
              performRefetch={() => runtimesQuery.refetch()} // to be removed after subscriptions are done
            >
              <RegisterRuntimeForm />
            </ModalWithForm>
          }
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
