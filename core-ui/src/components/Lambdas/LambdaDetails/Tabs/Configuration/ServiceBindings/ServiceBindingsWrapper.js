import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import { GET_SERVICE_INSTANCES } from '../../../../../../gql/queries';

import { Spinner } from 'react-shared';

import { ServiceBindingsService } from './ServiceBindingsService';
import ServiceBindings from './ServiceBindings';

import { filterServiceInstances } from './helpers';

export default function ServiceBindingsWrapper({ lambdaName }) {
  const namespace = LuigiClient.getEventData().environmentId;
  const { data, error, loading, refetch } = useQuery(GET_SERVICE_INSTANCES, {
    variables: {
      namespace,
    },
    fetchPolicy: 'no-cache',
  });

  if (error) {
    return `Error! ${error.message}`;
  }
  if (loading) {
    return <Spinner />;
  }

  const [
    injectedServiceInstances,
    notInjectedServiceInstances,
  ] = filterServiceInstances(lambdaName, data.serviceInstances);

  return (
    <ServiceBindingsService lambdaName={lambdaName}>
      <ServiceBindings
        injectedServiceInstances={injectedServiceInstances}
        notInjectedServiceInstances={notInjectedServiceInstances}
        refetchQuery={refetch}
      />
    </ServiceBindingsService>
  );
}

ServiceBindingsWrapper.propTypes = {
  lambdaName: PropTypes.string.isRequired,
};
