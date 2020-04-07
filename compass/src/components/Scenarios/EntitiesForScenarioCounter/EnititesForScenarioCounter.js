import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';

import {
  createEqualityQuery,
  GET_APPLICATIONS_FOR_SCENARIO,
  GET_RUNTIMES_FOR_SCENARIO,
} from '../gql';
import { Counter } from 'fundamental-react';

EnititesForScenarioCounter.propTypes = {
  scenarioName: PropTypes.string.isRequired,
  entityType: PropTypes.oneOf(['applications', 'runtimes']),
};

export default function EnititesForScenarioCounter({
  scenarioName,
  entityType,
}) {
  const query =
    entityType === 'applications'
      ? GET_APPLICATIONS_FOR_SCENARIO
      : GET_RUNTIMES_FOR_SCENARIO;

  const filter = {
    key: 'scenarios',
    query: createEqualityQuery(scenarioName),
  };

  const { data, loading, error } = useQuery(query, {
    fetchPolicy: 'network-only',
    variables: { filter: [filter] },
  });

  if (loading) {
    return '...';
  }
  if (error) {
    console.warn(error);
    return 'error';
  }

  return <Counter>{data[entityType].totalCount}</Counter>;
}
