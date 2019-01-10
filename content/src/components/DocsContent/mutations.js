import gql from 'graphql-tag';

export const SET_DOCS_LOADING_STATUS = gql`
  mutation setDocsLoadingStatus($docsLoadingStatus: Boolean) {
    setDocsLoadingStatus(docsLoadingStatus: $docsLoadingStatus) @client
  }
`;
