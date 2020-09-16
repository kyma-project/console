import gql from 'graphql-tag';

export const LAMBDA_EVENT_SUBSCRIPTION = gql`
  subscription functionEvent($namespace: String!, $functionName: String) {
    functionEvent(namespace: $namespace, functionName: $functionName) {
      type
      function {
        name
        namespace
        UID
        labels
        source
        runtime
        sourceType
        baseDir
        reference
        dependencies
        replicas {
          min
          max
        }
        resources {
          requests {
            memory
            cpu
          }
          limits {
            memory
            cpu
          }
        }
        env {
          name
          value
          valueFrom {
            type
            name
            key
            optional
          }
        }
        status {
          phase
          reason
          message
        }
      }
    }
  }
`;

export const EVENT_TRIGGER_EVENT_SUBSCRIPTION = gql`
  subscription triggerEvent($namespace: String!, $subscriber: SubscriberInput) {
    triggerEvent(namespace: $namespace, subscriber: $subscriber) {
      type
      trigger {
        name
        namespace
        spec {
          broker
          filter
        }
        status {
          reason
          status
        }
      }
    }
  }
`;

export const SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION = gql`
  subscription serviceBindingUsageEvent(
    $namespace: String!
    $resourceKind: String
    $resourceName: String
  ) {
    serviceBindingUsageEvent(
      namespace: $namespace
      resourceKind: $resourceKind
      resourceName: $resourceName
    ) {
      type
      serviceBindingUsage {
        name
        parameters {
          envPrefix {
            name
          }
        }
        serviceBinding {
          name
          serviceInstanceName
          secret {
            name
            data
          }
        }
      }
    }
  }
`;
