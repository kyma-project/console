import React from 'react';
import { graphql, compose } from 'react-apollo';

import DocsContent from './DocsContent.component';
import { DocsProcessor } from './DocsProcessor';

import { CONTENT_QUERY } from './queries';
import { SET_DOCS_LOADING_STATUS } from './mutations';

const DocsContentContainer = ({
  content: { loading, content },
  setDocsLoadingStatus,
}) => {
  setDocsLoadingStatus({
    variables: {
      docsLoadingStatus: loading,
    },
  });

  if (loading || !content) {
    return null;
  }

  const { docs = [] } = content;
  const newContent = { ...content };

  newContent.docs = new DocsProcessor(docs)
    .filterExternal()
    .improveRelativeLinks()
    .changeHeadersAtrs()
    .sortByOrder()
    .sortByType()
    .result();

  let docsTypesLength = {};
  newContent.docs.map(doc => {
    const type = doc.type || doc.title;
    if (!(type in docsTypesLength)) {
      docsTypesLength[type] = 0;
    }
    if (doc.title) docsTypesLength[type]++;

    return doc;
  });

  return <DocsContent content={newContent} docsTypesLength={docsTypesLength} />;
};

export default compose(
  graphql(CONTENT_QUERY, {
    name: 'content',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          contentType: props.contentMetadata.type,
          id: props.contentMetadata.id,
        },
      };
    },
  }),
  graphql(SET_DOCS_LOADING_STATUS, {
    name: 'setDocsLoadingStatus',
  }),
)(DocsContentContainer);
