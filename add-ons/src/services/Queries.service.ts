import { useContext } from 'react';
import gql from 'graphql-tag';
import createContainer from 'constate';
import { useQuery } from '@apollo/react-hooks';
import { LuigiContext } from './LuigiContext.service';

import { Configuration } from '../types';

// todo pewnie nie trzeba wszystkich
export const CLUSTER_ADDONS_CONFIGURATIONS_QUERY = gql`
  query clusterAddonsConfigurations {
    clusterAddonsConfigurations {
      name
      urls
      labels
      repositories {
        url
        secretRef {
          name
          namespace
        }
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
  }
`;

export const ADDONS_CONFIGURATIONS_QUERY = gql`
  query addonsConfigurations($namespace: String!) {
    addonsConfigurations(namespace: $namespace) {
      name
      urls
      labels
    }
  }
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
