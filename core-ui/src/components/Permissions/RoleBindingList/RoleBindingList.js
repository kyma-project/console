import React from 'react';
import PropTypes from 'prop-types';

import { GenericList, handleDelete, useNotification } from 'react-shared';
import CreateRoleBindingModal from './CreateRoleBindingModal.js';

import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  DELETE_ROLE_BINDING,
  DELETE_CLUSTER_ROLE_BINDING,
} from 'gql/mutations';
import { GET_ROLE_BINDINGS, GET_CLUSTER_ROLE_BINDINGS } from 'gql/queries';
import { Token } from 'fundamental-react';

RoleBindingList.propTypes = { namespaceId: PropTypes.string.isRequired };

export default function RoleBindingList({ namespaceId }) {
  const notification = useNotification();

  const { data, error, loading, refetch: refetchRoleBindings } = useQuery(
    GET_ROLE_BINDINGS,
    {
      variables: { namespace: namespaceId },
    },
  );
  const [deleteClusterRoleBinding] = useMutation(DELETE_CLUSTER_ROLE_BINDING, {
    refetchQueries: () => [{ query: GET_CLUSTER_ROLE_BINDINGS }],
  });

  const [deleteRoleBinding] = useMutation(DELETE_ROLE_BINDING, {
    refetchQueries: () => [
      { query: GET_ROLE_BINDINGS, variables: { namespace: namespaceId } },
    ],
  });

  const rowRenderer = entry => [
    entry.name,
    <span>
      <Token className="no-dismiss-tokens fd-has-margin-right-xs">
        {entry.roleRef.kind === 'Role' ? 'R' : 'CR'}
      </Token>
      {entry.roleRef.name}
    </span>,
  ];

  const actions = [
    {
      name: 'Delete',
      handler: entry => {
        const isCluster = entry.kind === 'ClusterRole';
        const type = `${isCluster ? 'Cluster ' : ''} Role Binding`;
        const mutation = isCluster
          ? () => deleteClusterRoleBinding({ variables: { name: entry.name } })
          : () =>
              deleteRoleBinding({
                variables: { name: entry.name, namespace: namespaceId },
              });
        return handleDelete(type, entry.name, entry.name, mutation, () =>
          notification.notifySuccess({
            content: `${type} ${entry.name} deleted`,
          }),
        );
      },
    },
  ];

  // performance shouln't be an issue, as list is (almost) sorted
  const entries = [...(data?.roleBindings || [])].sort((b1, b2) =>
    b1.name > b2.name ? 1 : -1,
  );
  return (
    <GenericList
      extraHeaderContent={
        <CreateRoleBindingModal
          namespaceId={namespaceId}
          refetchRoleBindingsFn={refetchRoleBindings}
        />
      }
      title="Role Bindings"
      actions={actions}
      entries={entries}
      headerRenderer={() => ['Group/User Name', 'Role Name']}
      rowRenderer={rowRenderer}
      server={error}
      loading={loading}
      textSearchProperties={['name', 'roleRef.name']}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
