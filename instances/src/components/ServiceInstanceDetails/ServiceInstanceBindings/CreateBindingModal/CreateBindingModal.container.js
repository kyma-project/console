import React from 'react';
import { graphql, withApollo, compose } from 'react-apollo';

import { USAGE_KIND_RESOURCES_QUERY, USAGE_KINDS_QUERY } from './queries';

import CreateBindingModal from './CreateBindingModal.component';

import builder from '../../../../commons/builder';

const CreateBindingContainer = ({ client, ...props }) => {
  const fetchUsageKindResources = usageKind => {
    return client.query({
      query: USAGE_KIND_RESOURCES_QUERY,
      variables: {
        usageKind: usageKind,
        environment: builder.getCurrentEnvironmentId(),
      },
      fetchPolicy: 'network-only',
    });
  };
  return (
    <CreateBindingModal
      fetchUsageKindResources={fetchUsageKindResources}
      {...props}
    />
  );
};

const CreateBindingContainerWithCompose = compose(
  graphql(USAGE_KINDS_QUERY, {
    name: 'usageKinds',
    options: () => {
      return {
        fetchPolicy: 'network-only',
      };
    },
  }),
)(CreateBindingContainer);

export default withApollo(CreateBindingContainerWithCompose);
