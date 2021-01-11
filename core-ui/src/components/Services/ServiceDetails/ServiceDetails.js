import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { GET_SERVICE } from 'gql/queries';
import {
  ResourceNotFound,
  useModuleEnabled,
  YamlEditorProvider,
} from 'react-shared';
import ServiceDetailsHeader from './ServiceDetailsHeader/ServiceDetailsHeader';
import ServiceApiRules from './ServiceApiRules/ServiceApiRules';
import ServiceEventsWrapper from './ServiceEventTriggers/ServiceEventsWrapper';

ServiceDetails.propTypes = {
  namespaceId: PropTypes.string.isRequired,
  serviceName: PropTypes.string.isRequired,
};

export default function ServiceDetails({ namespaceId, serviceName }) {
  const applicationModuleEnabled = useModuleEnabled('application');
  const eventingModuleEnabled = useModuleEnabled('eventing');
  const apiGatewayModuleEnabled = useModuleEnabled('apigateway');
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
      <ServiceEventsWrapper service={service} />
    ) : null;

  const apiRules = apiGatewayModuleEnabled ? (
    <ServiceApiRules service={service} namespace={namespaceId} />
  ) : null;

  return (
    <YamlEditorProvider>
      <ServiceDetailsHeader service={service} namespaceId={namespaceId} />
      {eventTriggers}
      {apiRules}
    </YamlEditorProvider>
  );
}
