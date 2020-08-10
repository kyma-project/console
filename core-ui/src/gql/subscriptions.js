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
