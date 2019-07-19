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

export const CLEAR_NOTIFICATION = gql`
  mutation clearNotification {
    clearNotification @client
  }
`;

export const SEND_NOTIFICATION = gql`
  mutation sendNotification(
    $title: String!
    $content: String!
    $color: String!
    $icon: String!
    $instanceName: String!
  ) {
    sendNotification(
      title: $title
      content: $content
      color: $color
      icon: $icon
      instanceName: $instanceName
    ) @client {
      title
    }
  }
`;
