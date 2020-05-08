import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { graphql, withApollo } from 'react-apollo';
import { compose } from 'recompose';

import { BINDABLE_RESOURCES_QUERY, USAGE_KINDS_QUERY } from './queries';

import BindApplicationModal from './BindApplicationModal.component';

const BindApplicationContainer = ({ client, ...props }) => {
  const fetchBindableResources = () => {
    return client.query({
      query: BINDABLE_RESOURCES_QUERY,
      variables: {
        namespace: LuigiClient.getContext().namespaceId,
      },
      fetchPolicy: 'network-only',
    });
  };
  return (
    <BindApplicationModal
      fetchBindableResources={fetchBindableResources}
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
)(BindApplicationContainer);

export default withApollo(BindApplicationContainerWithCompose);
