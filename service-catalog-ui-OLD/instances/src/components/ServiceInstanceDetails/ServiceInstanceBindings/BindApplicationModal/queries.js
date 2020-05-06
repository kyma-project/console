import gql from 'graphql-tag';

export const USAGE_KINDS_QUERY = gql`
  query usageKinds {
    usageKinds {
      name
      displayName
    }
  }
`;
export const BINDABLE_RESOURCES_QUERY = gql`
  query bindableResources($namespace: String!) {
    bindableResources(namespace: $namespace) {
      kind
      displayName
      resources {
        name
        namespace
      }
    }
  }
`;
