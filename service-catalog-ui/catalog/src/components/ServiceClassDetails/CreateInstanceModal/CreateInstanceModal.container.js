import React from 'react';
import { withApollo } from 'react-apollo';

import { checkInstanceExist } from './queries';

import builder from '../../../commons/builder';
import CreateInstanceModal from './CreateInstanceModal.component';

const CreateInstanceContainer = ({ client, ...props }) => {
  const instanceExists = name => {
    return client.query({
      query: checkInstanceExist,
      variables: {
        name: name,
        namespace: builder.getCurrentEnvironmentId(),
      },
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    });
  };
  return <CreateInstanceModal instanceExists={instanceExists} {...props} />;
};
export default withApollo(CreateInstanceContainer);
