import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { checkInstanceExist } from './queries';
import LuigiClient from '@luigi-project/client';
import CreateInstanceModal from './CreateInstanceModal.component';

export default compose(
  graphql(checkInstanceExist, {
    name: 'checkInstanceExistQuery',
    options: () => {
      return {
        variables: {
          namespace: LuigiClient.getContext().namespaceId,
        },
      };
    },
  }),
)(CreateInstanceModal);
