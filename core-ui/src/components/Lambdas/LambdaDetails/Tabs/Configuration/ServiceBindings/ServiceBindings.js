import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { Panel } from 'fundamental-react';

import { GenericList } from 'react-shared';

import { useQuery } from '@apollo/react-hooks';
import { GET_SERVICE_INSTANCES } from 'gql/queries';

import { useServiceBindings } from './ServiceBindingsService';

import { filterServiceInstances } from './helpers';

import ModalWithForm from 'components/ModalWithForm/ModalWithForm';
import CreateServiceBindingForm from 'components/Lambdas/CreateServiceBindingForm/CreateServiceBindingForm';

import './ServiceBindings.scss';

function CreateLambdaModal({ serviceBindingUsages = [], refetchLambda }) {
  const namespace = LuigiClient.getEventData().environmentId;
  const {
    data: { serviceInstances = [] },
    error,
    loading,
    refetch: refetchInstances,
  } = useQuery(GET_SERVICE_INSTANCES, {
    variables: {
      namespace,
      status: 'RUNNING',
    },
    fetchPolicy: 'no-cache',
  });

  const notInjectedServiceInstances = filterServiceInstances(
    serviceInstances,
    serviceBindingUsages,
  );

  return (
    <ModalWithForm
      title="Create new Service Binding"
      button={{
        glyph: 'add',
        text: 'Create Service Binding',
        option: 'light',
        compact: true,
      }}
      id="add-service-binding-modal"
      renderForm={props => (
        <CreateServiceBindingForm
          {...props}
          serviceInstances={notInjectedServiceInstances}
          refetchLambda={refetchLambda}
          refetchInstances={refetchInstances}
          serviceInstanceError={error}
          serviceInstanceLoading={loading}
        />
      )}
    />
  );
}

const ServiceBindings = ({
  serviceBindingUsages = [],
  notInjectedServiceInstances = [],
  refetchLambda,
}) => {
  const { deleteServiceBindingUsage } = useServiceBindings();

  const renderEnvs = bindingUsage => {
    let envPrefix = '';
    if (bindingUsage.parameters && bindingUsage.parameters.envPrefix) {
      envPrefix = bindingUsage.parameters.envPrefix.name || '';
    }

    const secretData =
      bindingUsage.serviceBinding.secret &&
      bindingUsage.serviceBinding.secret.data;
    const envs = Object.keys(secretData || {});
    if (!secretData || !envs.length) {
      return null;
    }

    return (
      <>
        {envs.map(env => (
          <div key={env}>
            {envPrefix}
            {env}
          </div>
        ))}
      </>
    );
  };

  const actions = [
    {
      name: 'Delete',
      handler: bindingUsage => {
        deleteServiceBindingUsage(bindingUsage, refetchLambda);
      },
    },
  ];
  const headerRenderer = () => ['Instance', 'Environment Variable Names'];
  const rowRenderer = bindingUsage => [
    <span data-test-id="service-instance-name">
      {bindingUsage.serviceBinding.serviceInstanceName}
    </span>,
    renderEnvs(bindingUsage),
  ];

  return (
    <Panel className="fd-has-margin-medium lambda-service-bindings">
      <Panel.Header>
        <Panel.Head title="Service Bindings" />
        <Panel.Actions>
          <CreateLambdaModal
            serviceBindingUsages={serviceBindingUsages}
            refetchLambda={refetchLambda}
          />
        </Panel.Actions>
      </Panel.Header>
      <Panel.Body>
        <GenericList
          actions={actions}
          entries={serviceBindingUsages}
          headerRenderer={headerRenderer}
          rowRenderer={rowRenderer}
        />
      </Panel.Body>
    </Panel>
  );
};

export default ServiceBindings;
