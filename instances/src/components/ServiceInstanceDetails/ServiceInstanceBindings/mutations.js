import gql from 'graphql-tag';

export const BINDING_CREATE_MUTATION = gql`
  mutation CreateServiceBinding(
    $serviceInstanceName: String!
    $environment: String!
    $parameters: JSON
  ) {
    createServiceBinding(
      serviceInstanceName: $serviceInstanceName
      environment: $environment
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
