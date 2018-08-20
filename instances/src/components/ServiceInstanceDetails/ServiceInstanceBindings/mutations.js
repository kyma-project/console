import gql from 'graphql-tag';

export const BINDING_CREATE_MUTATION = gql`
  mutation CreateServiceBinding(
    $serviceBindingName: String!
    $serviceInstanceName: String!
    $environment: String!
  ) {
    createServiceBinding(
      serviceBindingName: $serviceBindingName
      serviceInstanceName: $serviceInstanceName
      environment: $environment
    ) {
      name
    }
  }
`;

export const BINDING_USAGE_CREATE_MUTATION = gql`
  mutation CreateServiceBindingUsage(
    $createServiceBindingUsageInput: CreateServiceBindingUsageInput
  ) {
    createServiceBindingUsage(
      createServiceBindingUsageInput: $createServiceBindingUsageInput
    ) {
      name
    }
  }
`;

export const BINDING_DELETE_MUTATION = gql`
  mutation DeleteServiceBinding(
    $serviceBindingName: String!
    $environment: String!
  ) {
    deleteServiceBinding(
      serviceBindingName: $serviceBindingName
      environment: $environment
    ) {
      name
    }
  }
`;

export const BINDING_USAGE_DELETE_MUTATION = gql`
  mutation DeleteServiceBindingUsage(
    $serviceBindingUsageName: String!
    $environment: String!
  ) {
    deleteServiceBindingUsage(
      serviceBindingUsageName: $serviceBindingUsageName
      environment: $environment
    ) {
      name
    }
  }
`;
