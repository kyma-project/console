import gql from 'graphql-tag';

export const BINDING_CREATE_MUTATION = gql`
  mutation CreateServiceBinding(
    $serviceInstanceName: String!
    $namespace: String!
    $parameters: JSON
  ) {
    createServiceBinding(
      serviceInstanceName: $serviceInstanceName
      namespace: $namespace
      parameters: $parameters
    ) {
      name
    }
  }
`;

export const BINDING_USAGE_CREATE_MUTATION = gql`
  mutation CreateServiceBindingUsage(
    $namespace: String!
    $createServiceBindingUsageInput: CreateServiceBindingUsageInput
  ) {
    createServiceBindingUsage(
      namespace: $namespace
      createServiceBindingUsageInput: $createServiceBindingUsageInput
    ) {
      name
    }
  }
`;

export const BINDING_DELETE_MUTATION = gql`
  mutation DeleteServiceBinding(
    $serviceBindingName: String!
    $namespace: String!
  ) {
    deleteServiceBinding(
      serviceBindingName: $serviceBindingName
      namespace: $namespace
    ) {
      name
    }
  }
`;

export const BINDING_USAGE_DELETE_MUTATION = gql`
  mutation DeleteServiceBindingUsage(
    $serviceBindingUsageName: String!
    $namespace: String!
  ) {
    deleteServiceBindingUsage(
      serviceBindingUsageName: $serviceBindingUsageName
      namespace: $namespace
    ) {
      name
    }
  }
`;
