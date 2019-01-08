import React from "react";
import { graphql, compose } from 'react-apollo';

import DocsContent from "./DocsContent.component";
import { DocsProcessor } from "./DocsProcessor";

import { CONTENT_QUERY } from './queries';

const DocsContentContainer = ({ content: { loading, content } }) => {
  if (loading || !content) {
    return null;
  }

  const { docs = [], type, id } = content;
  const newContent = { ...content };

  newContent.docs = new DocsProcessor(docs)
    .filterExternal()
    .sortByOrder()
    .sortByType()
    .result();

  return (
    <DocsContent
      content={newContent}
    />
  );
};

export default compose(
  graphql(CONTENT_QUERY, {
    name: 'content',
    options: props => {
      return {
        variables: {
          contentType: props.contentMetadata.type,
          id: props.contentMetadata.id,
        },
        options: {
          fetchPolicy: 'cache-and-network',
        },
      };
    },
  }),
)(DocsContentContainer);
