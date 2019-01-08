import React from "react";
import { graphql, compose } from 'react-apollo';

import DocsContent from "./DocsContent.component";
import { DocsProcessor } from "./DocsProcessor";

import { CONTENT_QUERY } from './queries';

export default compose(
  graphql(CONTENT_QUERY, {
    name: 'content',
    options: props => {
      return {
        variables: {
          contentType: props.item.type,
          id: props.item.id,
        },
        options: {
          fetchPolicy: 'cache-and-network',
        },
      };
    },
  }),
)(props => {
  return (
    <DocsContent
      tokenize={tokenize}
      content={newContent}
      contentId={contentId}
    />
  );
});


const DocsContentContainer = ({ content, version, versions, contentId }) => {
  if (!content) {
    return null;
  }

  const { docs = [], type, id } = content;
  const newContent = { ...content };

  newContent.docs = new DocsProcessor(docs)
    .filterExternal()
    .sortByOrder()
    .sortByType()
    .replaceImagePaths({ type: tokenize(type), id, version, versions })
    .result();

  return (
    <DocsContent
      tokenize={tokenize}
      content={newContent}
      contentId={contentId}
    />
  );
};

export default DocsContentContainer;
