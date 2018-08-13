import { compose, graphql } from 'react-apollo';
import { SERVICE_INSTANCE_QUERY } from './queries';
import {
  BINDING_CREATE_MUTATION,
  BINDING_DELETE_MUTATION,
  BINDING_USAGE_CREATE_MUTATION,
  BINDING_USAGE_DELETE_MUTATION,
} from './mutations';
import { SERVICE_INSTANCES_DELETE_MUTATION } from '../ServiceInstances/mutations';
import ServiceInstanceDetails from './ServiceInstanceDetails.component';
import builder from '../../commons/builder';

export default compose(
  graphql(SERVICE_INSTANCE_QUERY, {
    name: 'serviceInstance',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          environment: builder.getCurrentEnvironmentId(),
          name: props.match.params.name,
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
  graphql(BINDING_CREATE_MUTATION, {
    props: ({ mutate }) => ({
      createBinding: (serviceBindingName, serviceInstanceName) =>
        mutate({
          variables: {
            serviceBindingName,
            serviceInstanceName,
            environment: builder.getCurrentEnvironmentId(),
          },
        }),
    }),
  }),
  graphql(BINDING_DELETE_MUTATION, {
    props: ({ mutate }) => ({
      deleteBinding: name =>
        mutate({
          variables: {
            serviceBindingName: name,
            environment: builder.getCurrentEnvironmentId(),
          },
        }),
    }),
  }),
  graphql(BINDING_USAGE_DELETE_MUTATION, {
    props: ({ mutate }) => ({
      deleteBindingUsage: name =>
        mutate({
          variables: {
            serviceBindingUsageName: name,
            environment: builder.getCurrentEnvironmentId(),
          },
        }),
    }),
  }),
  graphql(BINDING_USAGE_CREATE_MUTATION, {
    props: ({ mutate }) => ({
      createBindingUsage: createServiceBindingUsageInput =>
        mutate({
          variables: {
            createServiceBindingUsageInput,
          },
        }),
    }),
  }),
)(ServiceInstanceDetails);
