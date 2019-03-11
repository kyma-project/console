import gql from 'graphql-tag';

export const DOCS_LOADING_STATUS = gql`
  query docsLoadingStatus {
    docsLoadingStatus @client
  }
`;
