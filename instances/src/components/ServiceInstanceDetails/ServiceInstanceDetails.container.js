import React from 'react';
import { graphql, compose } from 'react-apollo';

import { SERVICE_INSTANCES_DETAILS } from './queries';
import { SERVICE_INSTANCES_DELETE_MUTATION } from '../ServiceInstances/mutations';

import ServiceInstanceDetails from './ServiceInstanceDetails.component';

import { Spinner } from '@kyma-project/react-components';
import { EmptyList } from './styled';

import builder from '../../commons/builder';

export default compose(
  graphql(SERVICE_INSTANCES_DETAILS, {
    name: 'serviceInstances',
    options: () => {
      return {
        variables: {
          environment: builder.getCurrentEnvironmentId(),
        },
      };
    },
  }),
  graphql(SERVICE_INSTANCES_DELETE_MUTATION, {
    props: ({ mutate }) => ({
      deleteServiceInstance: name =>
        mutate({
          variables: {
            name,
            environment: builder.getCurrentEnvironmentId(),
          },
        }),
    }),
  }),
)(({ serviceInstances, ...otherProps }) => {
  if (serviceInstances.loading) {
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );
  }

  const instanceName = otherProps.match.params.name;
  const items = serviceInstances.serviceInstances || [];
  const instance = items.filter(instance => instance.name === instanceName)[0];

  const serviceInstance = {
    serviceInstance: instance ? { ...instance } : undefined,
    loading: false,
  };

  return (
    <ServiceInstanceDetails serviceInstance={serviceInstance} {...otherProps} />
  );
});
