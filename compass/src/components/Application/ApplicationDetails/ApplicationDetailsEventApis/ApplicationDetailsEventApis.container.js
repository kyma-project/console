import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from '../../../../gql';
import { GET_APPLICATION, DELETE_EVENT_API } from './../../gql';
import _ from 'lodash';

import ApplicationDetailsEventApis from './ApplicationDetailsEventApis.component';

function updateCache(props, applicationId, apiId) {
  const client = props.result.client;
  const originalQuery = {
    query: GET_APPLICATION,
    variables: { id: applicationId },
  };
  const { application } = client.cache.readQuery(originalQuery);
  // needed for actually refreshing Query components
  const updatedApplication = _.cloneDeep(application);

  updatedApplication.eventAPIs.data = updatedApplication.eventAPIs.data.filter(
    eventApi => eventApi.id !== apiId,
  );
  updatedApplication.eventAPIs.totalCount -= 1;

  client.writeQuery({
    ...originalQuery,
    data: { application: updatedApplication },
  });
}

export default compose(
  graphql(DELETE_EVENT_API, {
    props: props => ({
      deleteEventAPI: (apiId, applicationId) => {
        props.mutate({ variables: { id: apiId } });
        updateCache(props, applicationId, apiId);
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ApplicationDetailsEventApis);
