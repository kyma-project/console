import gql from 'graphql-tag';

export const ADD_API_DEFINITION = gql`
  mutation addAPIDefinition($apiPackageId: ID!, $in: APIDefinitionInput!) {
    addAPIDefinitionToPackage(packageID: $apiPackageId, in: $in) {
      id
      name
      description
      targetURL
      spec {
        data
        format
        type
      }
      group
    }
  }
`;

export const ADD_EVENT_DEFINITION = gql`
  mutation addEventDefinition($apiPackageId: ID!, $in: EventDefinitionInput!) {
    addEventDefinitionToPackage(packageID: $apiPackageId, in: $in) {
      id
      name
      description
      spec {
        data
        format
        type
      }
      group
    }
  }
`;

export const GET_API_DEFININTION = gql`
  query apiDefinition(
    $applicationId: ID!
    $apiPackageId: ID!
    $apiDefinitionId: ID!
  ) {
    application(id: $applicationId) {
      name
      id
      package(id: $apiPackageId) {
        id
        name
        apiDefinition(id: $apiDefinitionId) {
          id
          name
          description
          targetURL
          spec {
            data
            format
            type
          }
          group
        }
      }
    }
  }
`;

export const GET_EVENT_DEFINITION = gql`
  query eventDefinition(
    $applicationId: ID!
    $apiPackageId: ID!
    $eventDefinitionId: ID!
  ) {
    application(id: $applicationId) {
      name
      id
      package(id: $apiPackageId) {
        id
        name
        eventDefinition(id: $eventDefinitionId) {
          id
          name
          description
          spec {
            data
            format
            type
          }
          group
        }
      }
    }
  }
`;

export const DELETE_API_DEFINITION = gql`
  mutation deleteApi($id: ID!) {
    deleteAPIDefinition(id: $id) {
      name
    }
  }
`;

export const DELETE_EVENT_DEFINITION = gql`
  mutation deleteEventApi($id: ID!) {
    deleteEventDefinition(id: $id) {
      name
    }
  }
`;
