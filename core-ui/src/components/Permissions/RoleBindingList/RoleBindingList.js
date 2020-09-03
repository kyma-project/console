import React from 'react';
import PropTypes from 'prop-types';

import { GenericList, handleDelete, useNotification } from 'react-shared';
import CreateRoleBindingModal from './CreateRoleBindingModal.js';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { DELETE_ROLE_BINDING } from 'gql/mutations';
import { GET_ROLE_BINDINGS } from 'gql/queries';
import { Token } from 'fundamental-react';

RoleBindingList.propTypes = { namespaceId: PropTypes.string.isRequired };

export default function RoleBindingList({ namespaceId }) {
  const notification = useNotification();

  const { data, error, loading } = useQuery(GET_ROLE_BINDINGS, {
    variables: { namespace: namespaceId },
  });
  const [deleteClusterRoleBinding] = useMutation(DELETE_ROLE_BINDING, {
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
      handler: entry =>
        handleDelete(
          'Role Binding',
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

  return (
    <GenericList
      extraHeaderContent={<CreateRoleBindingModal namespaceId={namespaceId} />}
      title="Cluster Role Bindings"
      actions={actions}
      entries={data?.roleBindings || []}
      headerRenderer={() => ['Group/User Name', 'Role Name']}
      rowRenderer={rowRenderer}
      server={error}
      loading={loading}
      textSearchProperties={['name', 'roleRef.name']}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
