import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { checkInstanceExist } from './queries';

import builder from 'builder';
import CreateInstanceModal from './CreateInstanceModal.component';

export default compose(
  graphql(checkInstanceExist, {
    name: 'checkInstanceExistQuery',
    options: () => {
      return {
        variables: {
          namespace: builder.getCurrentEnvironmentId(),
        },
      };
    },
  }),
)(CreateInstanceModal);
