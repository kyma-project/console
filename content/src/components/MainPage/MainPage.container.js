import React from 'react';
import { graphql, compose } from 'react-apollo';

import MainPage from './MainPage.component';

import { CLUSTER_DOCS_TOPICS } from './queries';

const filterExtensions = ['md'];

export default compose(
  graphql(CLUSTER_DOCS_TOPICS, {
    options: {
      variables: {
        filterExtensions: filterExtensions,
      },
    },
  }),
)(props => {
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
      clusterDocsTopicsComponents={otherClusterDocsTopic}
    />
  );
});
