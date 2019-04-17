import React from 'react';
import { graphql, compose } from 'react-apollo';

import MainPage from './MainPage.component';

import { CLUSTER_DOCS_TOPICS } from './queries';

const filterExtensions = ['md'];

export default compose(
  // graphql(CLUSTER_DOCS_TOPICS, {
  //   name: 'clusterDocsTopicsComponents',
  //   options: {
  //     variables: {
  //       viewContext: 'docs-ui',
  //       groupName: 'components',
  //       filterExtensions: filterExtensions,
  //     },
  //   },
  // }),
  // graphql(CLUSTER_DOCS_TOPICS, {
  //   name: 'clusterDocsTopicsRoot',
  //   options: {
  //     variables: {
  //       viewContext: 'docs-ui',
  //       groupName: 'root',
  //       filterExtensions: filterExtensions,
  //     },
  //   },
  // }),
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
  } = props;

  if (loading || !clusterDocsTopics) {
    return null;
  }

  // return <section>{JSON.stringify(props)}</section>;
  return (
    <MainPage
      {...props}
      clusterDocsTopicsRoot={clusterDocsTopics.find(
        elem => elem.name === 'kyma',
      )}
      clusterDocsTopicsComponents={clusterDocsTopics.filter(
        elem => elem.name !== 'kyma',
      )}
    />
  );
});
