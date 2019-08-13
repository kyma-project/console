import gql from 'graphql-tag';

export const GET_NOTIFICATION = gql`
  query GetNotification {
    notification @client {
      title
      content
      color
      icon
      visible
    }
  }
`;
