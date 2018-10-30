import React from 'react';
import { graphql, withApollo, compose } from 'react-apollo';

import { USAGE_KIND_RESOURCES_QUERY, USAGE_KINDS_QUERY } from './queries';
import { SEND_NOTIFICATION } from '../mutations';

import BindApplicationModal from './BindApplicationModal.component';

import builder from '../../../../commons/builder';

const BindApplicationContainer = ({ client, ...props }) => {
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
    <BindApplicationModal
      fetchUsageKindResources={fetchUsageKindResources}
      {...props}
    />
  );
};

const BindApplicationContainerWithCompose = compose(
  graphql(USAGE_KINDS_QUERY, {
    name: 'usageKinds',
    options: () => {
      return {
        fetchPolicy: 'network-only',
      };
    },
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(BindApplicationContainer);

export default withApollo(BindApplicationContainerWithCompose);
