import gql from 'graphql-tag';

export function handleSubscriptionArrayEvent(
  resource,
  setResource,
  eventType,
  changedResource,
) {
  switch (eventType) {
    case 'ADD':
      if (resource.find(r => r.name === changedResource.name)) {
        throw Error(`Duplicate name: ${changedResource.name}.`);
      }
      setResource([...resource, changedResource]);
      return;
    case 'DELETE':
      setResource(resource.filter(r => r.name !== changedResource.name));
      return;
    case 'UPDATE':
      const newResource = resource.filter(r => r.name !== changedResource.name);
      setResource([...newResource, changedResource]);
      return;
    default:
      return;
  }
}

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
