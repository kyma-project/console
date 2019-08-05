import gql from 'graphql-tag';

export const CLUSTER_DOCS_TOPICS = gql`
  query clusterDocsTopics(
    $viewContext: String
    $groupName: String
    $filterExtensions: [String!]
  ) {
    clusterDocsTopics(viewContext: $viewContext, groupName: $groupName) {
      name
      displayName
      description
      groupName
      assets {
        name
        metadata
        type
        files(filterExtensions: $filterExtensions) {
          url
          metadata
        }
      }
    }
  }
`;
