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
