import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import { GenericList } from 'react-shared';

import { useQuery } from '@apollo/react-hooks';
import { GET_ROLES } from 'gql/queries';

RoleList.propTypes = { namespaceId: PropTypes.string.isRequired };

export default function RoleList({ namespaceId }) {
  const navigateToRoleDetails = role =>
    LuigiClient.linkManager().navigate(`roles/${role.name}`);

  const { data, error, loading } = useQuery(GET_ROLES, {
    variables: { namespace: namespaceId },
  });

  const actions = [
    {
      name: 'Details',
      handler: navigateToRoleDetails,
    },
  ];

  const rowRenderer = entry => [
    <span className="link" onClick={() => navigateToRoleDetails(entry)}>
      {entry.name}
    </span>,
  ];

  return (
    <GenericList
      title="Roles"
      actions={actions}
      entries={data?.roles || []}
      headerRenderer={() => ['Name']}
      rowRenderer={rowRenderer}
      server={error}
      loading={loading}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
