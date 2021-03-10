import React from 'react';
import LuigiClient from '@luigi-project/client';

import { GenericList, useNotification, useDelete } from 'react-shared';
import { Link } from 'fundamental-react';

import CreateServiceBindingModal from './CreateServiceBindingModal';
import { SERVICE_BINDINGS_PANEL, ERRORS } from 'components/Lambdas/constants';

import './ServiceBindings.scss';

const headerRenderer = () => ['Instance', 'Environment Variable Names'];
const textSearchProperties = ['serviceBinding.spec.instanceRef.name']; //TODO support searching by env name

export default function ServiceBindings({
  lambda = {},
  serviceBindingsCombined,
  serverDataError,
  serverDataLoading,
}) {
  const notification = useNotification();

  const deleteServiceBindingUsage = useDelete();
  const serviceBindingsWithUsages = serviceBindingsCombined.filter(
    ({ serviceBindingUsage }) => serviceBindingUsage,
  );

  const renderEnvs = (secret, prefix = '') => {
    if (!secret) return 'Loading...'; // the secret is being created and will appear in a moment
    return (
      <>
        {Object.keys(secret.data).map(k => (
          <div key={k}>
            {prefix}
            {k}
          </div>
        ))}
      </>
    );
  };

  async function handleServiceBindingUsageDelete({ serviceBindingUsage: u }) {
    try {
      await deleteServiceBindingUsage(u.metadata.selfLink);
      notification.notifySuccess({
        title: 'Succesfully deleted Service Binding Usage',
      });
    } catch (e) {
      console.error(e);
      notification.notifyError({
        title: 'Failed to delete the Service Binding Usage',
        content: e.message,
      });
    }
  }

  const actions = [
    {
      name: 'Delete',
      handler: handleServiceBindingUsageDelete,
    },
  ];
  const rowRenderer = ({ secret, serviceBinding, serviceBindingUsage }) => [
    <Link
      className="link"
      data-test-id="service-instance-name"
      onClick={() =>
        LuigiClient.linkManager()
          .fromContext('namespaces')
          .navigate(
            `cmf-instances/details/${serviceBinding.spec.instanceRef.name}`,
          )
      }
    >
      {serviceBinding.spec.instanceRef.name}
    </Link>,
    renderEnvs(secret, serviceBindingUsage.spec.parameters?.envPrefix.name),
  ];

  const createServiceBindingModal = (
    <CreateServiceBindingModal
      lambda={lambda}
      serviceBindingsCombined={serviceBindingsCombined}
    />
  );

  return (
    <GenericList
      title={SERVICE_BINDINGS_PANEL.LIST.TITLE}
      textSearchProperties={textSearchProperties}
      showSearchField={true}
      showSearchSuggestion={false}
      extraHeaderContent={createServiceBindingModal}
      actions={actions}
      entries={serviceBindingsWithUsages}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={serverDataError}
      serverDataLoading={serverDataLoading}
      notFoundMessage={SERVICE_BINDINGS_PANEL.LIST.ERRORS.RESOURCES_NOT_FOUND}
      noSearchResultMessage={
        SERVICE_BINDINGS_PANEL.LIST.ERRORS.NOT_MATCHING_SEARCH_QUERY
      }
      serverErrorMessage={ERRORS.SERVER}
    />
  );
}
