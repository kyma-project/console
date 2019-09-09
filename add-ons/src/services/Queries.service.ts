import { useContext } from 'react';
import gql from 'graphql-tag';
import createContainer from 'constate';
import { useQuery } from '@apollo/react-hooks';
import { GlobalService } from '@kyma-project/common';

import { Configuration } from '../types';

const queryFields = `
  name
  urls
  labels
`;

export const CLUSTER_ADDONS_CONFIGURATIONS_QUERY = gql`
  query clusterAddonsConfigurations {
    clusterAddonsConfigurations {
      ${queryFields}
    }
  }
`;

export const ADDONS_CONFIGURATIONS_QUERY = gql`
  query addonsConfigurations(
    $namespace: String!
  ) {
    addonsConfigurations(
      namespace: $namespace
    ) {
      ${queryFields}
    }
  }
`;

interface AddonsConfigurationsVariables {
  namespace?: string;
}

const useQueries = () => {
  const { currentNamespace } = useContext(GlobalService);
  const query = currentNamespace
    ? ADDONS_CONFIGURATIONS_QUERY
    : CLUSTER_ADDONS_CONFIGURATIONS_QUERY;

  const { data, error, loading } = useQuery<
    {
      addonsConfigurations: Configuration[];
      clusterAddonsConfigurations: Configuration[];
    },
    AddonsConfigurationsVariables
  >(query, {
    variables: {
      namespace: currentNamespace,
    },
  });

  const addonsConfigurations = currentNamespace
    ? data && data.addonsConfigurations
    : data && data.clusterAddonsConfigurations;

  return {
    addonsConfigurations: addonsConfigurations || [],
    error,
    loading,
  };
};

const { Provider, Context } = createContainer(useQueries);
export { Provider as QueriesProvider, Context as QueriesService };
