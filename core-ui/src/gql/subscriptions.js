import gql from 'graphql-tag';

export const NAMESPACES_EVENT_SUBSCRIPTION = gql`
  subscription Namespaces($showSystemNamespaces: Boolean) {
    namespaceEvent(withSystemNamespaces: $showSystemNamespaces) {
      type
      namespace {
        name
        labels
        status
        pods {
          status
        }
        applications
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
