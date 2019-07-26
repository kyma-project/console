import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from '../../../../gql';
import { ADD_API, ADD_EVENT_API, GET_APPLICATION } from '../../gql';
import _ from 'lodash';

import CreateAPIModal from './CreateAPIModal.component';

// todo delete after implementing subscriptions
function updateCache(props, applicationId, data, isAsyncAPI) {
  const client = props.result.client;
  const originalQuery = {
    query: GET_APPLICATION,
    variables: { id: applicationId },
  };
  const { application } = client.readQuery(originalQuery);
  const updatedApplication = _.cloneDeep(application);

  if (isAsyncAPI) {
    updatedApplication.eventAPIs.data.push(data.addEventAPI);
    updatedApplication.eventAPIs.totalCount += 1;
  } else {
    updatedApplication.apis.data.push(data.addAPI);
    updatedApplication.apis.totalCount += 1;
  }
  client.writeQuery({
    ...originalQuery,
    data: { application: updatedApplication },
  });
}

export default compose(
  graphql(ADD_API, {
    props: props => ({
      addAPI: async (apiData, applicationID) => {
        const { data } = await props.mutate({
          variables: { applicationID, in: apiData },
        });
        updateCache(props, applicationID, data, false);
      },
    }),
  }),
  graphql(ADD_EVENT_API, {
    props: props => ({
      addEventAPI: async (apiData, applicationID) => {
        const { data } = await props.mutate({
          variables: { applicationID, in: apiData },
        });
        updateCache(props, applicationID, data, true);
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(CreateAPIModal);
