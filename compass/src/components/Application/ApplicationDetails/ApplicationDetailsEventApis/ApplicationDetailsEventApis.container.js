import { graphql, compose } from 'react-apollo';
import { SEND_NOTIFICATION } from '../../../../gql';

import ApplicationDetailsEventApis from './ApplicationDetailsEventApis.component';

export default compose(
  //   graphql(CHECK_APPLICATION_EXISTS, {
  //     name: 'existingApplications',
  //     options: props => {
  //       return {
  //         variables: {
  //           filter: [
  //             {
  //               label: 'group',
  //               values: ['production', 'experimental'],
  //               operator: 'ANY',
  //             },
  //           ],
  //         },
  //         fetchPolicy: 'network-only',
  //         errorPolicy: 'all',
  //       };
  //     },
  //   }),
  //   graphql(CREATE_APPLICATION_MUTATION, {
  //     props: ({ mutate }) => ({
  //       addApplication: data =>
  //         mutate({
  //           variables: {
  //             in: data,
  //           },
  //         }),
  //     }),
  //   }),
  graphql(SEND_NOTIFICATION, {
    name: 'sendNotification',
  }),
)(ApplicationDetailsEventApis);
