import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { ADD_API } from 'components/Application/gql';

import CreateApiForm from './CreateApiForm.component';

export default compose(
  graphql(ADD_API, {
    props: props => ({
      addAPI: async (apiData, packageID) => {
        await props.mutate({
          variables: { packageID, in: apiData },
        });
      },
    }),
  }),
)(CreateApiForm);
