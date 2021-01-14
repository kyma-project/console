import gql from 'graphql-tag';

export const CREATE_LAMBDA = gql`
  mutation createFunction(
    $name: String!
    $namespace: String!
    $params: FunctionMutationInput!
  ) {
    createFunction(name: $name, namespace: $namespace, params: $params) {
      name
    }
  }
`;

export const UPDATE_LAMBDA = gql`
  mutation updateFunction(
    $name: String!
    $namespace: String!
    $params: FunctionMutationInput!
  ) {
    updateFunction(name: $name, namespace: $namespace, params: $params) {
      name
    }
  }
`;

export const DELETE_LAMBDA = gql`
  mutation deleteFunction(
    $namespace: String!
    $function: FunctionMetadataInput!
  ) {
    deleteFunction(namespace: $namespace, function: $function) {
      name
    }
  }
`;

export const CREATE_REPOSITORY = gql`
  mutation createGitRepository(
    $namespace: String!
    $name: String!
    $spec: GitRepositorySpecInput!
  ) {
    createGitRepository(namespace: $namespace, name: $name, spec: $spec) {
      name
    }
  }
`;

export const UPDATE_REPOSITORY = gql`
  mutation updateGitRepository(
    $namespace: String!
    $name: String!
    $spec: GitRepositorySpecInput!
  ) {
    updateGitRepository(namespace: $namespace, name: $name, spec: $spec) {
      name
    }
  }
`;

export const DELETE_REPOSITORY = gql`
  mutation deleteGitRepository($namespace: String!, $name: String!) {
    deleteGitRepository(namespace: $namespace, name: $name) {
      name
    }
  }
`;

export const CREATE_MANY_EVENT_TRIGGERS = gql`
  mutation createManyTriggers(
    $namespace: String!
    $triggers: [TriggerCreateInput!]!
    $ownerRef: [OwnerReferenceInput!]
  ) {
    createManyTriggers(
      namespace: $namespace
      triggers: $triggers
      ownerRef: $ownerRef
    ) {
      name
    }
  }
`;

export const DELETE_ONE_EVENT_TRIGGER = gql`
  mutation deleteTrigger($namespace: String!, $triggerName: String!) {
    deleteTrigger(namespace: $namespace, triggerName: $triggerName) {
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

export const DELETE_API_RULE = gql`
  mutation deleteAPIRule($name: String!, $namespace: String!) {
    deleteAPIRule(name: $name, namespace: $namespace) {
      name
    }
  }
`;
