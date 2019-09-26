import gql from 'graphql-tag';

export const GET_NAMESPACES = gql`
  query Namespaces($showSystemNamespaces: Boolean) {
    namespaces(withSystemNamespaces: $showSystemNamespaces) {
      name
      pods {
        status
      }
      applications
      isSystemNamespace
    }
  }
`;

export const NAMESPACES_EVENT_SUBSCRIPTION = gql`
  subscription Namespaces($showSystemNamespaces: Boolean) {
    namespaceEvent(withSystemNamespaces: $showSystemNamespaces) {
      type
      namespace {
        name
        pods {
          status
        }
        applications
        isSystemNamespace
      }
    }
  }
`;
