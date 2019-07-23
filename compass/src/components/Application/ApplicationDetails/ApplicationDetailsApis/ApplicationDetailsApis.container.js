import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from '../../../../gql';
import { GET_APPLICATION, DELETE_API } from './../../gql';
import _ from 'lodash';

import ApplicationDetailsApis from './ApplicationDetailsApis.component';

function updateCache(props, applicationId, apiId) {
  const client = props.result.client;
  const originalQuery = {
    query: GET_APPLICATION,
    variables: { id: applicationId },
  };
  const { application } = client.cache.readQuery(originalQuery);
  // needed for actually refreshing Query components
  const updatedApplication = _.cloneDeep(application);
  updatedApplication.apis.data = updatedApplication.apis.data.filter(
    api => api.id !== apiId,
  );
  updatedApplication.apis.totalCount -= 1;
  client.writeQuery({
    ...originalQuery,
    data: { application: updatedApplication },
  });
}

export default compose(
  graphql(DELETE_API, {
    props: props => ({
      deleteAPI: (apiId, applicationId) => {
        props.mutate({ variables: { id: apiId } });
        updateCache(props, applicationId, apiId);
      },
    }),
  }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ApplicationDetailsApis);
