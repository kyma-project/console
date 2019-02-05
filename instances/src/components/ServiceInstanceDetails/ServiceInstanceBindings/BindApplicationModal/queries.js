import gql from 'graphql-tag';

export const USAGE_KINDS_QUERY = gql`
  query usageKinds {
    usageKinds {
      name
      displayName
    }
  }
`;
export const USAGE_KIND_RESOURCES_QUERY = gql`
  query usageKindsResources($usageKind: String!, $namespace: String!) {
    usageKindResources(usageKind: $usageKind, namespace: $namespace) {
      name
    }
  }
`;
