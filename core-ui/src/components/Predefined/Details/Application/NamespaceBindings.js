import React from 'react';

import CreateBindingModal from './CreateBindingModal/CreateBindingModal';
import EditNamespaceBinding from './EditNamespaceBinding';
import ServicesBoundModal from './ServicesBoundModal';
import {
  GenericList,
  useGetList,
  useDelete,
  handleDelete,
  useNotification,
} from 'react-shared';

export default function NamespaceBindings(application) {
  const deleteRequest = useDelete();
  const notification = useNotification();

  const { metadata, spec } = application;
  const { data, loading, error, silentRefetch } = useGetList(
    aM => aM.metadata.name === metadata.name,
  )('/apis/applicationconnector.kyma-project.io/v1alpha1/applicationmappings', {
    pollingInterval: 3000,
  });

  const headerRenderer = () => ['Name', 'Service & event bindings'];
  const totalBindingsCount = spec.services.flatMap(s => s.entries).length;
  const alreadyBoundNamespaces = data?.map(aM => aM.metadata.namespace) || [];
  const rowRenderer = binding => [
    <ServicesBoundModal binding={binding} />,
    `${binding.spec.services?.length || 0}/${totalBindingsCount}`,
  ];

  const actions = [
    {
      name: 'Edit',
      component: binding => (
        <EditNamespaceBinding binding={binding} application={application} />
      ),
    },
    {
      name: 'Delete',
      handler: binding =>
        handleDelete(
          'Binding',
          null,
          binding.metadata.name,
          () => deleteRequest(binding.metadata.selfLink),
          () => {
            silentRefetch();
            notification.notifySuccess({
              content: 'Binding deleted',
            });
          },
        ),
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
