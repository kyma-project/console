import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { withProps } from 'recompose';

import {
  GET_API_DEFININTION,
  DELETE_API_DEFINITION,
  DELETE_EVENT_DEFINITION,
  GET_EVENT_DEFINITION,
} from './../gql';
import ApiDetails from './ApiDetails.component';

export default compose(
  graphql(GET_API_DEFININTION, {
    name: 'getApiDefinition',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          applicationId: props.applicationId,
          apiPackageId: props.apiPackageId,
          apiDefinitionId: props.apiId,
        },
      };
    },
  }),
  graphql(GET_EVENT_DEFINITION, {
    name: 'getEventDefinition',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          applicationId: props.applicationId,
          apiPackageId: props.apiPackageId,
          eventDefinitionId: props.eventApiId,
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
