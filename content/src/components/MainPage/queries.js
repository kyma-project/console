import gql from 'graphql-tag';

export const TOPICS_QUERY = gql`
  query Topics($input: [InputTopic!]!) {
    topics(input: $input) {
      id
      contentType
      sections {
        name
        anchor
        topicType
        titles {
          name
          anchor
          titles {
            name
            anchor
          }
        }
      }
    }
  }
`;

export const DOCS_LOADING_STATUS = gql`
  query docsLoadingStatus {
    docsLoadingStatus @client
  }
`;
