import React from 'react';

import CreateBindingModal from './CreateBindingModal';
import EditNamespaceBinding from './EditNamespaceBinding';
import ServicesBoundModal from './ServicesBoundModal';
import { GenericList, useGetList, useDelete } from 'react-shared';

export default function NamespaceBindings(application) {
  const deleteRequest = useDelete();

  const { metadata, spec } = application;
  const { data, loading, error } = useGetList(
    aM => aM.metadata.name === metadata.name,
  )('/apis/applicationconnector.kyma-project.io/v1alpha1/applicationmappings', {
    pollingInterval: 3000,
  });

  const headerRenderer = () => ['Name', 'Service & event bindings', ''];
  const totalBindingsCount = spec.services.flatMap(s => s.entries).length;
  const alreadyBoundNamespaces = data?.map(aM => aM.metadata.namespace) || [];
  const rowRenderer = binding => [
    <ServicesBoundModal binding={binding} />,
    `${binding.spec.services?.length || 0}/${totalBindingsCount}`,
    <EditNamespaceBinding binding={binding} application={application} />,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: async binding => {
        try {
          await deleteRequest(binding.metadata.selfLink);
        } catch (e) {
          console.warn(e);
        }
      },
    },
  ];

  return (
    <GenericList
      extraHeaderContent={
        <CreateBindingModal
          application={application}
          alreadyBoundNamespaces={alreadyBoundNamespaces}
        />
      }
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
