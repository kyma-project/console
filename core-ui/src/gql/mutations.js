import gql from 'graphql-tag';

export const DELETE_NAMESPACE = gql`
  mutation deleteNamespace($name: String!) {
    deleteNamespace(name: $name) {
      name
    }
  }
`;

export const CREATE_LAMBDA = gql`
  mutation createFunction(
    $name: String!
    $namespace: String!
    $labels: Labels!
    $size: String!
    $runtime: String!
  ) {
    createFunction(
      name: $name
      namespace: $namespace
      labels: $labels
      size: $size
      runtime: $runtime
    ) {
      name
      namespace
      labels
      size
      runtime
    }
  }
`;

export const UPDATE_LAMBDA = gql`
  mutation updateFunction(
    $name: String!
    $namespace: String!
    $params: FunctionUpdateInput!
  ) {
    updateFunction(name: $name, namespace: $namespace, params: $params) {
      name
      namespace
      labels
      size
      runtime
      content
      dependencies
    }
  }
`;

export const DELETE_LAMBDA = gql`
  mutation DeleteFunction($name: String!, $namespace: String!) {
    deleteFunction(name: $name, namespace: $namespace) {
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
