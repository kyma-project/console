import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { GenericList, Spinner } from 'react-shared';

import { useQuery } from '@apollo/react-hooks';
import { GET_SERVICE_INSTANCES } from 'gql/queries';

import { useServiceBindings } from './ServiceBindingsService';

import { filterServiceInstances } from './helpers';

import ModalWithForm from 'components/ModalWithForm/ModalWithForm';
import CreateServiceBindingForm from 'components/Lambdas/CreateServiceBindingForm/CreateServiceBindingForm';

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

  let content = null;
  if (error) {
    content = <p>Error! {error.message}</p>;
  }
  if (!content && loading) {
    content = <Spinner />;
  }

  const notInjectedServiceInstances = filterServiceInstances(
    serviceInstances,
    serviceBindingUsages,
  );
  if (!content && !notInjectedServiceInstances.length) {
    content = (
      <p>
        No Service Instances available to bind. Create a Service Instance first.
      </p>
    );
  }

  return (
    <ModalWithForm
      title="Create new Service Binding"
      button={{
        glyph: 'add',
        text: 'Create Service Binding',
        option: 'light',
      }}
      id="add-service-binding-modal"
      renderForm={props =>
        content || (
          <CreateServiceBindingForm
            {...props}
            serviceInstances={notInjectedServiceInstances}
            refetchLambda={refetchLambda}
            refetchInstances={refetchInstances}
          />
        )
      }
    />
  );
}

const ServiceBindings = ({ serviceBindingUsages = [], refetchLambda }) => {
  const { deleteServiceBindingUsage } = useServiceBindings();

  const retrieveEnvs = bindingUsage => {
    let envPrefix = '';
    if (bindingUsage.parameters && bindingUsage.parameters.envPrefix) {
      envPrefix = bindingUsage.parameters.envPrefix.name || '';
    }

    const secretData =
      bindingUsage.serviceBinding.secret &&
      bindingUsage.serviceBinding.secret.data;

    const envs = Object.keys(secretData || {});
    if (!secretData || !envs.length) {
      return [];
    }

    return envs.map(env => `${envPrefix}${env}`);
  };

  const renderEnvs = bindingUsage => {
    return (
      <>
        {bindingUsage.envs.map(env => (
          <div key={env}>{env}</div>
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
    <span
      className="link"
      data-test-id="service-instance-name"
      onClick={() =>
        LuigiClient.linkManager()
          .fromContext('namespaces')
          .navigate(
            `cmf-instances/details/${bindingUsage.serviceBinding.serviceInstanceName}`,
          )
      }
    >
      {bindingUsage.serviceBinding.serviceInstanceName}
    </span>,
    renderEnvs(bindingUsage),
  ];
  const textSearchProperties = [
    'serviceBinding.serviceInstanceName',
    'serviceBinding.secret.data',
    'parameters.envPrefix.name',
    'envs',
  ];

  const createLambdaModal = (
    <CreateLambdaModal
      serviceBindingUsages={serviceBindingUsages}
      refetchLambda={refetchLambda}
    />
  );

  const performedBindingUsages = serviceBindingUsages.map(usage => ({
    ...usage,
    envs: retrieveEnvs(usage),
  }));

  return (
    <GenericList
      title="Service Bindings"
      showSearchField={true}
      textSearchProperties={textSearchProperties}
      showSearchSuggestion={false}
      extraHeaderContent={createLambdaModal}
      actions={actions}
      entries={performedBindingUsages}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
    />
  );
};

export default ServiceBindings;
