import gql from 'graphql-tag';

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
