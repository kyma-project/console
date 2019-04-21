import gql from 'graphql-tag';
import createContainer from 'constate';
import { useQuery } from 'react-apollo-hooks';

export const ADDONS_CONFIGURATIONS_QUERY = gql`
  query addonsConfigurations {
    addonsConfigurations {
      name
      urls
      labels
    }
  }
`;

const useQueries = () => {
  const { data, error, loading } = useQuery(ADDONS_CONFIGURATIONS_QUERY);

  return {
    addonsConfigurations: data.addonsConfigurations,
    error,
    loading,
  };
};

const { Provider, Context } = createContainer(useQueries);
export { Provider as QueriesProvider, Context as QueriesService };
