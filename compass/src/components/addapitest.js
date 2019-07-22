import React from 'react';
import AddAPIModal from './Application/ApplicationDetails/AddAPIModal/AddAPIModal';
import { GET_APPLICATION } from './Application/gql';
import { graphql } from 'react-apollo';

const APP_ID = 'e5876d33-f114-4a59-980a-57586c168523';

const config = {
  options: props => ({ variables: { id: APP_ID } }),
};

function addapitest(props) {
  return (
    <>
    {!!props.data.application && <>
        <p>APIsy: {props.data.application.apis.data.length}</p>
        <p>Event APIsy: {props.data.application.eventAPIs.data.length}</p>
    </>}
      <AddAPIModal application={{ id: APP_ID }} />
    </>
  );
}

export default graphql(GET_APPLICATION, config)(addapitest);
