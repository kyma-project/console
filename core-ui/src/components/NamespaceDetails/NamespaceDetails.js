import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { GET_NAMESPACE } from 'gql/queries';

import { ResourceNotFound, setWindowTitle } from 'react-shared';
import NamespaceDetailsHeader from './NamespaceDetailsHeader/NamespaceDetailsHeader';
import NamespaceWorkloads from './NamespaceWorkloads/NamespaceWorkloads';
import NamespaceApplications from './NamespaceApplications/NamespaceApplications';

NamespaceDetails.propTypes = { name: PropTypes.string.isRequired };

export default function NamespaceDetails({ name }) {
  setWindowTitle('Namespace Details');
  const { data, error, loading } = useQuery(GET_NAMESPACE, {
    variables: { name },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const namespace = data.namespace;
  if (!namespace) {
    return (
      <ResourceNotFound
        resource="Namespace"
        breadcrumb="Namespaces"
        path="/"
        fromClosestContext={false}
      />
    );
  }

  return (
    <>
      <NamespaceDetailsHeader namespace={namespace} />
      <NamespaceWorkloads namespace={namespace} />
      <NamespaceApplications namespace={namespace} />
    </>
  );
}
