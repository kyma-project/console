import React from 'react';

import { CHECK_INSTANCE_EXISTS } from './queries';

import builder from '../../../commons/builder';
import CreateInstanceModal from './CreateInstanceModal.component';

const CreateInstanceContainer = ({ client, ...props }) => {
  const instanceExists = name => {
    return client.query({
      query: CHECK_INSTANCE_EXISTS,
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

export default CreateInstanceContainer;
