import { graphql, withApollo } from 'react-apollo';
import React from 'react';
import { compose } from 'recompose';
import { checkInstanceExist } from './queries';

import builder from '../../../commons/builder';
import CreateInstanceModal from './CreateInstanceModal';

export default compose(
  graphql(checkInstanceExist, {
    name: 'checkInstanceExistQuery',
    options: props => {
      return {
        variables: {
          namespace: builder.getCurrentEnvironmentId(),
        },
      };
    },
  }),
)(CreateInstanceModal);
