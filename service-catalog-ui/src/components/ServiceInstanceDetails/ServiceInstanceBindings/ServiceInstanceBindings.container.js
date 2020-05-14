import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import LuigiClient from '@kyma-project/luigi-client';
import {
  BINDING_USAGE_CREATE_MUTATION,
  BINDING_CREATE_MUTATION,
  BINDING_DELETE_MUTATION,
  BINDING_USAGE_DELETE_MUTATION,
} from './mutations';

import ServiceInstanceBindings from './ServiceInstanceBindings.component';

export default compose(
  graphql(BINDING_CREATE_MUTATION, {
    props: ({ mutate }) => ({
      createBinding: (serviceInstanceName, parameters) =>
        mutate({
          variables: {
            serviceInstanceName,
            namespace: LuigiClient.getContext().namespaceId,
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
            namespace: LuigiClient.getContext().namespaceId,
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
            namespace: LuigiClient.getContext().namespaceId,
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
            namespace: LuigiClient.getContext().namespaceId,
          },
        }),
    }),
  }),
)(ServiceInstanceBindings);
