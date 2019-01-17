import gql from "graphql-tag";

export const CONTENT_QUERY = gql`
  query Content($contentType: String!, $id: String!) {
    content(contentType: $contentType, id: $id)
  }
`;
