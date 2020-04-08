import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { GenericList } from 'react-shared';

import { useServiceBindings } from './ServiceBindingsService';

import CreateServiceBindingModal from './CreateServiceBindingModal';

import { SERVICE_BINDINGS_PANEL, ERRORS } from 'components/Lambdas/constants';

import './ServiceBindings.scss';

export default function ServiceBindings({ lambda = {}, refetchLambda }) {
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

  const createServiceBindingModal = (
    <CreateServiceBindingModal lambda={lambda} refetchLambda={refetchLambda} />
  );

  const performedBindingUsages = (lambda.serviceBindingUsages || []).map(
    usage => ({
      ...usage,
      envs: retrieveEnvs(usage),
    }),
  );

  return (
    <GenericList
      title={SERVICE_BINDINGS_PANEL.LIST.TITLE}
      textSearchProperties={textSearchProperties}
      showSearchField={true}
      showSearchSuggestion={false}
      extraHeaderContent={createServiceBindingModal}
      actions={actions}
      entries={performedBindingUsages}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      notFoundMessage={SERVICE_BINDINGS_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND}
      noSearchResultMessage={
        SERVICE_BINDINGS_PANEL.LIST.ERRORS.NOT_MATCHING_SEARCH_QUERY
      }
      serverErrorMessage={ERRORS.SERVER}
    />
  );
}
