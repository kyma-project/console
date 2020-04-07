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

export const CREATE_SERVICE_BINDING = gql`
  mutation createServiceBinding(
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

export const CREATE_SERVICE_BINDING_USAGE = gql`
  mutation createServiceBindingUsage(
    $createServiceBindingUsageInput: CreateServiceBindingUsageInput
    $namespace: String!
  ) {
    createServiceBindingUsage(
      createServiceBindingUsageInput: $createServiceBindingUsageInput
      namespace: $namespace
    ) {
      name
    }
  }
`;

export const DELETE_SERVICE_BINDING_USAGE = gql`
  mutation deleteServiceBindingUsage(
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

export const DELETE_SERVICE_BINDING_USAGES = gql`
  mutation deleteServiceBindingUsages(
    $serviceBindingUsageNames: [String!]!
    $namespace: String!
  ) {
    deleteServiceBindingUsages(
      serviceBindingUsageNames: $serviceBindingUsageNames
      namespace: $namespace
    ) {
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

export const CREATE_API_RULE = gql`
  mutation createAPIRule(
    $name: String!
    $namespace: String!
    $params: APIRuleInput!
  ) {
    createAPIRule(name: $name, namespace: $namespace, params: $params) {
      name
    }
  }
`;

export const UPDATE_API_RULE = gql`
  mutation updateAPIRule(
    $name: String!
    $namespace: String!
    $params: APIRuleInput!
  ) {
    updateAPIRule(name: $name, namespace: $namespace, params: $params) {
      name
    }
  }
`;

export const DELETE_API_RULE = gql`
  mutation deleteAPIRule($name: String!, $namespace: String!) {
    deleteAPIRule(name: $name, namespace: $namespace) {
      name
    }
  }
`;

export const UNREGISTER_APPLICATION = gql`
  mutation unregisterApplication($id: ID!) {
    unregisterApplication(id: $id) {
      name
      id
    }
  }
`;

export const CONNECT_APPLICATION = gql`
  mutation requestOneTimeTokenForApplication($id: ID!) {
    requestOneTimeTokenForApplication(id: $id) {
      rawEncoded
      legacyConnectorURL
    }
  }
`;

export const REGISTER_APPLICATION = gql`
  mutation registerApplication($in: ApplicationRegisterInput!) {
    registerApplication(in: $in) {
      name
      id
    }
  }
`;

export const BIND_NAMESPACE = gql`
  mutation($namespace: String!, $application: String!) {
    enableApplication(
      namespace: $namespace
      application: $application
      allServices: true
    ) {
      namespace
      application
    }
  }
`;

export const UNBIND_NAMESPACE = gql`
  mutation($namespace: String!, $application: String!) {
    disableApplication(namespace: $namespace, application: $application) {
      namespace
      application
    }
  }
`;

export const DELETE_API_PACKAGE = gql`
  mutation deletePackage($id: ID!) {
    deletePackage(id: $id) {
      id
    }
  }
`;

export const CREATE_API_PACKAGE = gql`
  mutation addPackage($applicationId: ID!, $in: PackageCreateInput!) {
    addPackage(applicationID: $applicationId, in: $in) {
      name
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

export const ADD_API_DEFINITION = gql`
  mutation addAPI($apiPackageId: ID!, $in: APIDefinitionInput!) {
    addAPIDefinitionToPackage(packageID: $apiPackageId, in: $in) {
      name
    }
  }
`;

export const ADD_EVENT_DEFINITION = gql`
  mutation addEventDefinition($apiPackageId: ID!, $in: EventDefinitionInput!) {
    addEventDefinitionToPackage(packageID: $apiPackageId, in: $in) {
      name
    }
  }
`;

export const UPDATE_API_DEFINITION = gql`
  mutation updateAPIDefinition($id: ID!, $in: APIDefinitionInput!) {
    updateAPIDefinition(id: $id, in: $in) {
      id
      name
    }
  }
`;

export const UPDATE_EVENT_DEFINITION = gql`
  mutation updateEventDefinition($id: ID!, $in: EventDefinitionInput!) {
    updateEventDefinition(id: $id, in: $in) {
      id
      name
    }
  }
`;

export const REGISTER_APPLICATION_FROM_TEMPLATE = gql`
  mutation registerApplicationFromTemplate($in: ApplicationFromTemplateInput!) {
    registerApplicationFromTemplate(in: $in) {
      name
    }
  }
`;

export const UPDATE_API_PACKAGE = gql`
  mutation updatePackage($id: ID!, $in: PackageUpdateInput!) {
    updatePackage(id: $id, in: $in) {
      name
    }
  }
`;
