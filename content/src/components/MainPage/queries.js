import gql from 'graphql-tag';

export const TOPICS_QUERY = gql`
  query Topics($input: [InputTopic!]!) {
    topics(input: $input) {
      id
      contentType
      sections {
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
