import gql from 'graphql-tag';

export const SEND_NOTIFICATION = gql`
  mutation sendNotification(
    $title: String!
    $color: String!
    $icon: String!
    $instanceName: String!
  ) {
    sendNotification(
      title: $title
      color: $color
      icon: $icon
      instanceName: $instanceName
    ) @client {
      title
    }
  }
`;
