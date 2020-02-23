import React from 'react';
import { Panel } from 'fundamental-react';

import { GenericList } from 'react-shared';

import { useServiceBindings } from './ServiceBindingsService';

import ModalWithForm from 'components/ModalWithForm/ModalWithForm';
import CreateServiceBindingForm from 'components/Lambdas/CreateServiceBindingForm/CreateServiceBindingForm';

import './ServiceBindings.scss';

function CreateLambdaModal({ serviceInstances = [], refetchQuery }) {
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
          serviceInstances={serviceInstances}
          refetchQuery={refetchQuery}
        />
      )}
    />
  );
}

const ServiceBindings = ({
  injectedServiceInstances = [],
  notInjectedServiceInstances = [],
  refetchQuery,
}) => {
  const { deleteServiceBindingUsage } = useServiceBindings();

  const renderEnvs = bindingUsage => {
    let envPrefix = '';
    if (bindingUsage.parameters) {
      envPrefix = bindingUsage.parameters.envPrefix.name;
    }

    const secretData =
      bindingUsage.serviceBinding.secret &&
      bindingUsage.serviceBinding.secret.data;
    const envs = Object.keys(secretData);
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
      handler: entry => {
        deleteServiceBindingUsage(
          entry.serviceInstanceName,
          entry.bindingUsage,
          refetchQuery,
        );
      },
    },
  ];
  const headerRenderer = () => ['Instance', 'Environment Variable Names'];
  const rowRenderer = item => [
    <span data-test-id="service-instance-name">
      {item.serviceInstanceName}
    </span>,
    renderEnvs(item.bindingUsage),
  ];

  return (
    <Panel className="fd-has-margin-medium lambda-service-bindings">
      <Panel.Header>
        <Panel.Head title="Service Bindings" />
        <Panel.Actions>
          <CreateLambdaModal
            serviceInstances={notInjectedServiceInstances}
            refetchQuery={refetchQuery}
          />
        </Panel.Actions>
      </Panel.Header>
      <Panel.Body>
        <GenericList
          actions={actions}
          entries={injectedServiceInstances}
          headerRenderer={headerRenderer}
          rowRenderer={rowRenderer}
        />
      </Panel.Body>
    </Panel>
  );
};

export default ServiceBindings;
