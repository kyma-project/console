import React from 'react';
import CreateBindingModal from './CreateBindingModal';
import { GenericList, useGetList } from 'react-shared';

export default function NamespaceBindings(application) {
  const { metadata, spec } = application;
  const { data, loading, error } = useGetList(
    aM => aM.metadata.name === metadata.name,
  )('/apis/applicationconnector.kyma-project.io/v1alpha1/applicationmappings', {
    pollingInterval: 3000,
  });

  const headerRenderer = () => ['Name', 'Service & event bindings'];

  const totalBindingsCount = spec.services.flatMap(s => s.entries).length;

  const rowRenderer = ({ metadata }) => [
    metadata.name,
    // `${spec.services.length}/${totalBindingsCount}`,
  ];

  const actions = [
    {
      name: 'Unbind',
      handler: binding => {
        console.log(binding);
      },
    },
    {
      name: 'Edit',
      handler: binding => {
        console.log(binding);
      },
    },
  ];

  return (
    <GenericList
      extraHeaderContent={<CreateBindingModal application={application} />}
      actions={actions}
      title="Namespace Bindings"
      showSearchField={false}
      entries={data || []}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={error}
      serverDataLoading={loading}
      notFoundMessage="No bindings"
    />
  );
}
