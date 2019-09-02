import { graphql, compose } from 'react-apollo';
import { withProps } from 'recompose';

import {
  GET_APPLICATION_WITH_APIS,
  DELETE_API,
  DELETE_EVENT_API,
  GET_APPLICATION_WITH_EVENT_APIS,
} from './../gql';
import ApiDetails from './ApiDetails.component';

export default compose(
  graphql(GET_APPLICATION_WITH_APIS, {
    name: 'getApisForApplication',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          applicationId: props.applicationId,
        },
      };
    },
  }),
  graphql(GET_APPLICATION_WITH_EVENT_APIS, {
    name: 'getEventApisForApplication',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          applicationId: props.applicationId,
        },
      };
    },
  }),
  graphql(DELETE_EVENT_API, {
    props: ({ mutate }) => ({
      deleteEventApi: id =>
        mutate({
          variables: {
            id: id,
          },
        }),
    }),
  }),
  graphql(DELETE_API, {
    props: ({ mutate }) => ({
      deleteApi: id =>
        mutate({
          variables: {
            id: id,
          },
        }),
    }),
  }),
  withProps(props => props),
)(ApiDetails);
