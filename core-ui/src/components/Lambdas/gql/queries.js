import gql from 'graphql-tag';

export const GET_LAMBDAS = gql`
  query functions($namespace: String!) {
    functions(namespace: $namespace) {
      name
      namespace
      labels
      runtime
      sourceType
      status {
        phase
        reason
        message
      }
    }
    gitRepositories(namespace: $namespace) {
      name
      namespace
      spec {
        url
        auth {
          type
          secretName
        }
      }
    }
  }
`;

export const GET_LAMBDA = gql`
  query function($name: String!, $namespace: String!) {
    function(name: $name, namespace: $namespace) {
      name
      namespace
      UID
      labels
      source
      dependencies
      runtime
      sourceType
      baseDir
      reference
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
`;

export const GET_EVENT_ACTIVATIONS = gql`
  query eventActivations($namespace: String!) {
    eventActivations(namespace: $namespace) {
      name
      displayName
      sourceId
      events {
        eventType
        version
        description
        schema
      }
    }
  }
`;

export const GET_EVENT_TRIGGERS = gql`
  query eventTriggers($namespace: String!, $subscriber: SubscriberInput) {
    triggers(namespace: $namespace, subscriber: $subscriber) {
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
`;

export const GET_SERVICE_INSTANCES = gql`
  query serviceInstances($namespace: String!, $status: InstanceStatusType) {
    serviceInstances(namespace: $namespace, status: $status) {
      name
      bindable
      servicePlan {
        bindingCreateParameterSchema
      }
      serviceBindings {
        items {
          name
          parameters
          secret {
            name
            data
          }
        }
      }
    }
  }
`;

export const GET_SERVICE_BINDING_USAGES = gql`
  query serviceBindingUsages(
    $namespace: String!
    $resourceKind: String
    $resourceName: String
  ) {
    serviceBindingUsages(
      namespace: $namespace
      resourceKind: $resourceKind
      resourceName: $resourceName
    ) {
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
`;

export const GET_CONFIG_MAP = gql`
  query configMap($name: String!, $namespace: String!) {
    configMap(name: $name, namespace: $namespace) {
      json
    }
  }
`;

export const GET_SERVICE = gql`
  query service($name: String!, $namespace: String!) {
    service(name: $name, namespace: $namespace) {
      name
    }
  }
`;
