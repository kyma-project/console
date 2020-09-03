import React from 'react';
import PropTypes from 'prop-types';

import { GET_ROLE } from 'gql/queries';
import { useQuery } from 'react-apollo';

import { PageHeader } from 'react-shared';
import RoleCard from './RoleCard/RoleCard';
import './RoleDetails.scss';

RoleDetails.propTypes = {
  roleName: PropTypes.string.isRequired,
  namespaceId: PropTypes.string.isRequired,
};

export default function RoleDetails({ roleName, namespaceId }) {
  roleName = decodeURIComponent(roleName);

  const { data, error, loading } = useQuery(GET_ROLE, {
    variables: { namespace: namespaceId, name: roleName },
  });

  const breadcrumbItems = [
    { name: 'Permissions', path: '/', fromContext: 'permissions' },
    { name: '' },
  ];

  const content = () => {
    if (error) return error.message;
    if (loading) return 'Loading...';
    const rules = data?.role?.rules || [];

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
      <PageHeader title={roleName} breadcrumbItems={breadcrumbItems}>
        <PageHeader.Column title="Namespace">{namespaceId}</PageHeader.Column>
      </PageHeader>
      {content()}
    </>
  );
}
