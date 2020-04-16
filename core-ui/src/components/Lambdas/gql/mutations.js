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
  mutation deleteFunction($function: FunctionMetadataInput!) {
    deleteFunction(function: $function) {
      name
    }
  }
`;

export const CREATE_MANY_EVENT_TRIGGERS = gql`
  mutation createManyTriggers(
    $triggers: [TriggerCreateInput!]!
    $ownerRef: [OwnerReference!]
  ) {
    createManyTriggers(triggers: $triggers, ownerRef: $ownerRef) {
      name
    }
  }
`;

export const DELETE_ONE_EVENT_TRIGGER = gql`
  mutation deleteTrigger($trigger: TriggerMetadataInput!) {
    deleteTrigger(trigger: $trigger) {
      name
    }
  }
`;
