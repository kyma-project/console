import gql from 'graphql-tag';

export const CLEAR_NOTIFICATION = gql`
  mutation clearNotification {
    clearNotification @client
  }
`;
