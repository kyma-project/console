import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { withProps } from 'recompose';

import {
  GET_APPLICATION_WITH_API_DEFINITIONS,
  DELETE_API_DEFINITION,
  DELETE_EVENT_DEFINITION,
  GET_APPLICATION_WITH_EVENT_DEFINITIONS,
} from './../gql';
import ApiDetails from './ApiDetails.component';

export default compose(
  graphql(GET_APPLICATION_WITH_API_DEFINITIONS, {
    name: 'getApiDefinitionsForApplication',
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
  graphql(GET_APPLICATION_WITH_EVENT_DEFINITIONS, {
    name: 'getEventDefinitionsForApplication',
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
  graphql(DELETE_EVENT_DEFINITION, {
    props: ({ mutate }) => ({
      deleteEventDefinition: id =>
        mutate({
          variables: {
            id: id,
          },
        }),
    }),
  }),
  graphql(DELETE_API_DEFINITION, {
    props: ({ mutate }) => ({
      deleteAPIDefinition: id =>
        mutate({
          variables: {
            id: id,
          },
        }),
    }),
  }),
  withProps(props => props),
)(ApiDetails);
