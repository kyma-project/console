import gql from 'graphql-tag';

export const CLUSTER_DOCS_TOPICS = gql`
  query clusterDocsTopics($viewContext: String!, $groupName: String!) {
    clusterDocsTopics(viewContext: $viewContext, groupName: $groupName)
      @client {
      name
      displayName
      description
      assets
    }
  }
`;
