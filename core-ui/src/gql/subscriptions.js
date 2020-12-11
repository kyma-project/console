import gql from 'graphql-tag';

export const NAMESPACES_EVENT_SUBSCRIPTION = gql`
  subscription Namespaces($showSystemNamespaces: Boolean) {
    namespaceEvent(withSystemNamespaces: $showSystemNamespaces) {
      type
      namespace {
        name
        labels
        status
        podsCount
        healthyPodsCount
        applicationsCount
        isSystemNamespace
      }
    }
  }
`;

export const API_RULE_EVENT_SUBSCRIPTION = gql`
  subscription apiRuleEvent($namespace: String!, $serviceName: String) {
    apiRuleEvent(namespace: $namespace, serviceName: $serviceName) {
      type
      apiRule {
        name
        generation
        spec {
          rules {
            path
            methods
            accessStrategies {
              name
              config
            }
          }
          service {
            host
            name
            port
          }
        }
        status {
          apiRuleStatus {
            code
            description
          }
        }
      }
    }
  }
`;

export const DEPLOYMENT_EVENT_SUBSCRIPTION = gql`
  subscription Deployments($namespace: String!) {
    deploymentEvent(namespace: $namespace) {
      type
      deployment {
        name
        status {
          replicas
          readyReplicas
        }
      }
    }
  }
`;

export const POD_EVENT_SUBSCRIPTION = gql`
  subscription Pods($namespace: String!) {
    podEvent(namespace: $namespace) {
      type
      pod {
        name
        status
      }
    }
  }
`;

export const OAUTH_CLIENT_EVENT_SUBSCRIPTION = gql`
  subscription oAuthClientEvent($namespace: String!) {
    oAuth2ClientEvent(namespace: $namespace) {
      type
      client {
        name
        error {
          code
          description
        }
        spec {
          grantTypes
          responseTypes
        }
      }
    }
  }
`;

export const SECRET_EVENT_SUBSCRIPTION = gql`
  subscription secretEvent($namespace: String!) {
    secretEvent(namespace: $namespace) {
      type
      secret {
        name
        data
      }
    }
  }
`;

export const SECRET_EVENT_SUBSCRIPTION_LIST = gql`
  subscription secretEvent($namespace: String!) {
    secretEvent(namespace: $namespace) {
      type
      secret {
        name
        type
        labels
        creationTime
      }
    }
  }
`;

export const EVENT_SUBSCRIPTION_SUBSCRIPTION = gql`
  subscription subscriptionSubscription(
    $ownerName: String!
    $namespace: String!
  ) {
    subscriptionSubscription(ownerName: $ownerName, namespace: $namespace) {
      type
      subscription {
        name
        namespace
        spec {
          filter {
            filters {
              eventType {
                property
                type
                value
              }
            }
          }
        }
        status {
          conditions {
            status
            message
            reason
            type
          }
        }
      }
    }
  }
`;
