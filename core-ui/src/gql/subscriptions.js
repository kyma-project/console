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

export const APPLICATIONS_EVENT_SUBSCRIPTION = gql`
  subscription Application {
    applicationEvent {
      application {
        name
        status
        enabledInNamespaces
      }
      type
    }
  }
`;
