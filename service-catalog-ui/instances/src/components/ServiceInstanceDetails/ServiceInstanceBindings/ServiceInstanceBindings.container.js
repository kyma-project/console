import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import {
  BINDING_USAGE_CREATE_MUTATION,
  BINDING_CREATE_MUTATION,
  BINDING_DELETE_MUTATION,
  BINDING_USAGE_DELETE_MUTATION,
} from './mutations';

import ServiceInstanceBindings from './ServiceInstanceBindings.component';

import builder from '../../../commons/builder';

export default compose(
  graphql(BINDING_CREATE_MUTATION, {
    props: ({ mutate }) => ({
      createBinding: (serviceInstanceName, parameters) =>
        mutate({
          variables: {
            serviceInstanceName,
            namespace: builder.getCurrentEnvironmentId(),
            parameters,
          },
        }),
    }),
  }),
  graphql(BINDING_USAGE_CREATE_MUTATION, {
    props: ({ mutate }) => ({
      createBindingUsage: createServiceBindingUsageInput =>
        mutate({
          variables: {
            namespace: builder.getCurrentEnvironmentId(),
            createServiceBindingUsageInput,
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
            namespace: builder.getCurrentEnvironmentId(),
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
            namespace: builder.getCurrentEnvironmentId(),
          },
        }),
    }),
  }),
)(ServiceInstanceBindings);
