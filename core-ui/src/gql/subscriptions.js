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
