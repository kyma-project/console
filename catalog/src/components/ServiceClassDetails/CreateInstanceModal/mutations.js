import gql from 'graphql-tag';

export const SEND_NOTIFICATION = gql`
  mutation sendNotification($title: String!, $color: String!, $icon: String!) {
    sendNotification(title: $title, color: $color, icon: $icon) @client {
      title
    }
  }
`;
