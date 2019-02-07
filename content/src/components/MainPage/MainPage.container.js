import React from 'react';
import { graphql, compose } from 'react-apollo';

import MainPage from './MainPage.component';

import { TOPICS_QUERY, DOCS_LOADING_STATUS } from './queries';

import { prepareTopicsList } from '../../commons/yaml.js';

export default compose(
  graphql(TOPICS_QUERY, {
    name: 'topics',
    options: props => {
      return {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables: {
          input: prepareTopicsList(),
        },
      };
    },
  }),
  graphql(DOCS_LOADING_STATUS, {
    name: 'docsLoadingStatus',
  }),
)(props => {
  if (props.topics.loading || !props.topics.topics) return null;

  return <MainPage {...props} topics={props.topics.topics} />;
});
