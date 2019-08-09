import gql from 'graphql-tag';
import createContainer from 'constate';
import { useQuery } from 'react-apollo-hooks';

export const CLUSTER_ADDONS_CONFIGURATIONS_QUERY = gql`
  query clusterAddonsConfigurations {
    clusterAddonsConfigurations {
      name
      urls
      labels
    }
  }
`;

const useQueries = () => {
  const { data, error, loading } = useQuery(
    CLUSTER_ADDONS_CONFIGURATIONS_QUERY,
  );

  return {
    addonsConfigurations: data.clusterAddonsConfigurations,
    error,
    loading,
  };
};

const { Provider, Context } = createContainer(useQueries);
export { Provider as QueriesProvider, Context as QueriesService };
