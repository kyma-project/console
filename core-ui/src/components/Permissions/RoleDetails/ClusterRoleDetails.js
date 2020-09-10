import React from 'react';
import PropTypes from 'prop-types';

import { GET_CLUSTER_ROLE } from 'gql/queries';
import { useQuery } from 'react-apollo';

import { PageHeader } from 'react-shared';
import RoleCard from './RoleCard/RoleCard';
import './RoleDetails.scss';

RoleDetails.propTypes = { roleName: PropTypes.string.isRequired };

export default function RoleDetails({ roleName }) {
  roleName = decodeURIComponent(roleName);
  const { data, error, loading } = useQuery(GET_CLUSTER_ROLE, {
    variables: { name: roleName },
  });

  const breadcrumbItems = [
    { name: 'Permissions', path: '/', fromContext: 'global-permissions' },
    { name: '' },
  ];

  const content = () => {
    if (error) return error.message;
    if (loading) return 'Loading...';
    const rules = data?.clusterRole?.rules || [];

    return (
      <div className="fd-has-margin-m role__rules">
        {rules.map((rule, i) => (
          <RoleCard key={i} {...rule} />
        ))}
      </div>
    );
  };

  return (
    <>
      <PageHeader title={roleName} breadcrumbItems={breadcrumbItems} />
      {content()}
    </>
  );
}
