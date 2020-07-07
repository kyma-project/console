import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { GET_SERVICE } from 'gql/queries';
import { ResourceNotFound, useModuleEnabled } from 'react-shared';
import ServiceDetailsHeader from './ServiceDetailsHeader/ServiceDetailsHeader';
import ServiceApiRules from './ServiceApiRules/ServiceApiRules';
import ServiceEventTriggers from './ServiceEventTriggers/ServiceEventTriggers';

ServiceDetails.propTypes = {
  namespaceId: PropTypes.string.isRequired,
  serviceName: PropTypes.string.isRequired,
};

export default function ServiceDetails({ namespaceId, serviceName }) {
  const applicationModuleEnabled = useModuleEnabled('application');
  const eventingModuleEnabled = useModuleEnabled('eventing');
  const { data, loading, error } = useQuery(GET_SERVICE, {
    variables: {
      namespace: namespaceId,
      name: serviceName,
    },
    fetchPolicy: 'network-only',
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const service = data.service;
  if (!service) {
    return (
      <ResourceNotFound
        resource="Service"
        breadcrumb="Services"
        path="/"
        fromContext="services"
      />
    );
  }
  const eventTriggers =
    applicationModuleEnabled && eventingModuleEnabled ? (
      <ServiceEventTriggers service={service} />
    ) : null;

  return (
    <>
      <ServiceDetailsHeader service={service} namespaceId={namespaceId} />
      <ServiceApiRules service={service} namespaceId={namespaceId} />
      {eventTriggers}
    </>
  );
}
