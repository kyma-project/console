import React from 'react';
import { graphql, withApollo, compose } from 'react-apollo';

import { CHECK_INSTANCE_EXISTS } from './queries';
import { SEND_NOTIFICATION } from './mutations';

import builder from '../../../commons/builder';
import CreateInstanceModal from './CreateInstanceModal.component';

const CreateInstanceContainer = ({ client, ...props }) => {
  const instanceExists = name => {
    return client.query({
      query: CHECK_INSTANCE_EXISTS,
      variables: {
        name: name,
        environment: builder.getCurrentEnvironmentId(),
      },
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
  };
  return <CreateInstanceModal instanceExists={instanceExists} {...props} />;
};

const CreateInstanceContainerWithCompose = compose(
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(CreateInstanceContainer);

export default withApollo(CreateInstanceContainerWithCompose);
