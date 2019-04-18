import gql from 'graphql-tag';

export const CLUSTER_DOCS_TOPICS = gql`
  query clusterDocsTopicss(
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
        type
        files(filterExtensions: $filterExtensions) {
          url
          metadata
        }
      }
    }
  }
`;
