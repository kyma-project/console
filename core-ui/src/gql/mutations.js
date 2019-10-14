import gql from 'graphql-tag';

export const DELETE_NAMESPACE = gql`
  mutation deleteNamespace($name: String!) {
    deleteNamespace(name: $name) {
      name
    }
  }
`;

export const CREATE_NAMESPACE = gql`
  mutation createNamespace($name: String!, $labels: Labels) {
    createNamespace(name: $name, labels: $labels) {
      name
    }
  }
`;

export const CREATE_LIMIT_RANGE = gql`
  mutation createLimitRange(
    $namespace: String!
    $name: String!
    $limitRange: LimitRangeInput!
  ) {
    createLimitRange(
      namespace: $namespace
      name: $name
      limitRange: $limitRange
    ) {
      name
    }
  }
`;

export const CREATE_RESOURCE_QUOTA = gql`
  mutation createResourceQuota(
    $namespace: String!
    $name: String!
    $resourceQuota: ResourceQuotaInput!
  ) {
    createResourceQuota(
      namespace: $namespace
      name: $name
      resourceQuota: $resourceQuota
    ) {
      name
    }
  }
`;
