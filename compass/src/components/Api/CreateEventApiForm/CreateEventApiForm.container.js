import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { ADD_EVENT_API } from 'components/Application/gql';

import CreateEventApiForm from './CreateEventApiForm.component';

export default compose(
  graphql(ADD_EVENT_API, {
    props: props => ({
      addEventAPI: async (apiData, applicationID) => {
        await props.mutate({
          variables: { applicationID, in: apiData },
        });
      },
    }),
  }),
)(CreateEventApiForm);
