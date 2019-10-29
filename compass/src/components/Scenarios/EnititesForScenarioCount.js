import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import { createEqualityQuery } from './gql';
import { Counter } from 'fundamental-react';

EnititesForScenarioCount.propTypes = {
  scenarioName: PropTypes.string.isRequired,
  entityType: PropTypes.oneOf(['applications', 'runtimes']),
  query: PropTypes.object.isRequired,
};

export default function EnititesForScenarioCount({
  scenarioName,
  entityType,
  query,
}) {
  const filter = {
    key: 'scenarios',
    query: createEqualityQuery(scenarioName),
  };

  return (
    <Query query={query} variables={{ filter: [filter] }}>
      {({ loading, error, data }) => {
        if (loading) {
          return '...';
        }
        if (error) {
          console.warn(error);
          return 'N/A';
        }

        return <Counter>{data[entityType].totalCount}</Counter>;
      }}
    </Query>
  );
}
