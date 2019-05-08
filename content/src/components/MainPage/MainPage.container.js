import React from 'react';
import { graphql } from 'react-apollo';

import MainPage from './MainPage.component';

import { CLUSTER_DOCS_TOPICS } from './queries';

const filterExtensions = ['md'];

export default graphql(CLUSTER_DOCS_TOPICS, {
  options: {
    variables: {
      filterExtensions: filterExtensions,
      viewContext: 'docs-ui',
    },
  },
})(props => {
  const {
    data: { loading, clusterDocsTopics },
    ...rest
  } = props;

  if (loading || !clusterDocsTopics) {
    return null;
  }

  const rootClusterDocsTopic = [];
  const otherClusterDocsTopic = [];

  clusterDocsTopics.forEach(docs => {
    if (docs.name === 'kyma') {
      rootClusterDocsTopic.push(docs);
    } else {
      otherClusterDocsTopic.push(docs);
    }
  });

  return (
    <MainPage
      {...rest}
      clusterDocsTopicsRoot={rootClusterDocsTopic}
      clusterDocsTopicsExternal={otherClusterDocsTopic}
    />
  );
});
