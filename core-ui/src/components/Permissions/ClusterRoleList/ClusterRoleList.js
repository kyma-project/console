import React from 'react';
import LuigiClient from '@luigi-project/client';
import { GenericList } from 'react-shared';

import { useQuery } from '@apollo/react-hooks';
import { GET_CLUSTER_ROLES } from 'gql/queries';

export default function ClusterRoleList() {
  const navigateToRoleDetails = role =>
    LuigiClient.linkManager().navigate(
      `/home/global-permissions/roles/${encodeURIComponent(role.name)}`,
    );

  const { data, error, loading } = useQuery(GET_CLUSTER_ROLES);

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
      title="Cluster Roles"
      actions={actions}
      entries={data?.clusterRoles || []}
      headerRenderer={() => ['Name']}
      rowRenderer={rowRenderer}
      server={error}
      loading={loading}
      pagination={{ itemsPerPage: 20, autoHide: true }}
    />
  );
}
