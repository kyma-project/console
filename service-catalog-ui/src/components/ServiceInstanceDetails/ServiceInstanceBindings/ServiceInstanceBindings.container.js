import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import LuigiClient from '@luigi-project/client';
import {
  BINDING_USAGE_CREATE_MUTATION,
  BINDING_CREATE_MUTATION,
  BINDING_DELETE_MUTATION,
  BINDING_USAGE_DELETE_MUTATION,
} from './mutations';
import { getServiceInstanceDetails } from 'helpers/instancesGQL/queries';

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
    props: ({ mutate, ownProps }) => ({
      deleteBinding: name => {
        const instanceName = ownProps.serviceInstance.name;
        const namespace = LuigiClient.getContext().namespaceId;
        return mutate({
          variables: {
            serviceBindingName: name,
            namespace,
          },
          // todo remove after subscriptions are fixed
          refetchQueries: () => [
            {
              query: getServiceInstanceDetails,
              variables: {
                name: instanceName,
                namespace,
              },
            },
          ],
        });
      },
    }),
  }),
  graphql(BINDING_USAGE_DELETE_MUTATION, {
    props: ({ mutate, ownProps }) => ({
      deleteBindingUsage: name => {
        const instanceName = ownProps.serviceInstance.name;
        const namespace = LuigiClient.getContext().namespaceId;
        return mutate({
          variables: {
            serviceBindingUsageName: name,
            namespace,
          },
          // todo remove after subscriptions are fixed
          refetchQueries: () => [
            {
              query: getServiceInstanceDetails,
              variables: {
                name: instanceName,
                namespace,
              },
            },
          ],
        });
      },
    }),
  }),
)(ServiceInstanceBindings);
