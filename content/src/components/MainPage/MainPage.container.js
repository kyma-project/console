import React from 'react';
import { graphql, compose } from 'react-apollo';

import MainPage from './MainPage.component';

import { CLUSTER_DOCS_TOPICS } from './queries';

const filterExtensions = ['md'];

export default compose(
  graphql(CLUSTER_DOCS_TOPICS, {
    name: 'clusterDocsTopicsComponents',
    options: {
      variables: {
        viewContext: 'docs-ui',
        groupName: 'components',
        filterExtensions: filterExtensions,
      },
    },
  }),
  graphql(CLUSTER_DOCS_TOPICS, {
    name: 'clusterDocsTopicsRoot',
    options: {
      variables: {
        viewContext: 'docs-ui',
        groupName: 'root',
        filterExtensions: filterExtensions,
      },
    },
  }),
)(props => {
  if (
    props.clusterDocsTopicsRoot.loading ||
    props.clusterDocsTopicsComponents.loading ||
    !props.clusterDocsTopicsRoot.clusterDocsTopics ||
    !props.clusterDocsTopicsComponents.clusterDocsTopics
  ) {
    return null;
  }

  return (
    <MainPage
      {...props}
      clusterDocsTopicsRoot={props.clusterDocsTopicsRoot.clusterDocsTopics}
      clusterDocsTopicsComponents={
        props.clusterDocsTopicsComponents.clusterDocsTopics
      }
    />
  );
});
