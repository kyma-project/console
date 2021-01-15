import React from 'react';

import { GenericList, handleDelete, useNotification } from 'react-shared';
import CreateClusterRoleBindingModal from './CreateClusterRoleBindingModal';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { DELETE_CLUSTER_ROLE_BINDING } from 'gql/mutations';
import { GET_CLUSTER_ROLE_BINDINGS } from 'gql/queries';

export default function ClusterRoleBindingList() {
  const notification = useNotification();

  const {
    data,
    error,
    loading,
    refetch: refetchClusterRoleBindings,
  } = useQuery(GET_CLUSTER_ROLE_BINDINGS);
  const [deleteClusterRoleBinding] = useMutation(DELETE_CLUSTER_ROLE_BINDING, {
    refetchQueries: () => [{ query: GET_CLUSTER_ROLE_BINDINGS }],
  });

  const actions = [
    {
      name: 'Delete',
      handler: entry =>
        handleDelete(
          'Cluster Role Binding',
          entry.name,
          entry.name,
          () => deleteClusterRoleBinding({ variables: { name: entry.name } }),
          () =>
            notification.notifySuccess({
              content: `Cluster Role Binding ${entry.name} deleted`,
            }),
        ),
    },
  ];

  // performance shouln't be an issue, as list is (almost) sorted
  const entries = [...(data?.clusterRoleBindings || [])].sort((b1, b2) =>
    b1.name > b2.name ? 1 : -1,
  );

  return (
    <GenericList
      extraHeaderContent={
        <CreateClusterRoleBindingModal
          refetchClusterRoleBindingsFn={refetchClusterRoleBindings}
        />
      }
      title="Cluster Role Bindings"
      actions={actions}
      entries={entries}
      headerRenderer={() => ['Group/User Name', 'Role Name']}
      rowRenderer={entry => [entry.name, entry.roleRef.name]}
      server={error}
      loading={loading}
      textSearchProperties={['name', 'roleRef.name']}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
