import { useContext } from 'react';
import gql from 'graphql-tag';
import createContainer from 'constate';
import { useQuery } from '@apollo/react-hooks';
import { LuigiContext } from './LuigiContext.service';

import { Configuration } from '../types';

export const ADDONS_CONFIGURATION_FRAGMENT = gql`
  fragment AddonsConfiguration on AddonsConfiguration {
    name
    urls
    labels
    repositories {
      url
    }
    status {
      phase
      repositories {
        url
        status
        reason
        message
        addons {
          name
          status
          version
          reason
          message
        }
      }
    }
  }
`;

export const CLUSTER_ADDONS_CONFIGURATIONS_QUERY = gql`
  query clusterAddonsConfigurations {
    clusterAddonsConfigurations {
      ...AddonsConfiguration
    }
  }

  ${ADDONS_CONFIGURATION_FRAGMENT}
`;

export const ADDONS_CONFIGURATIONS_QUERY = gql`
  query addonsConfigurations($namespace: String!) {
    addonsConfigurations(namespace: $namespace) {
      ...AddonsConfiguration
    }
  }

  ${ADDONS_CONFIGURATION_FRAGMENT}
`;

interface AddonsConfigurationsVariables {
  namespace?: string;
}

const useQueries = () => {
  const { namespaceId: currentNamespace } = useContext(LuigiContext);
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
