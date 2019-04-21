import gql from 'graphql-tag';
import createContainer from 'constate';
import { useMutation } from 'react-apollo-hooks';
import { ConfigurationLabels } from '../types';

export const CREATE_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation createAddonsConfiguration(
    $name: String!
    $urls: [String!]!
    $labels: Labels
  ) {
    createAddonsConfiguration(name: $name, urls: $urls, labels: $labels) {
      name
    }
  }
`;

export const UPDATE_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation updateAddonsConfiguration(
    $name: String!
    $urls: [String!]!
    $labels: Labels
  ) {
    updateAddonsConfiguration(name: $name, urls: $urls, labels: $labels) {
      name
    }
  }
`;

export const DELETE_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation deleteAddonsConfiguration($name: String!) {
    deleteAddonsConfiguration(name: $name) {
      name
    }
  }
`;

export const ADD_ADDONS_CONFIGURATION_URLS_MUTATION = gql`
  mutation addAddonsConfigurationURLs($name: String!, $urls: [String!]!) {
    addAddonsConfigurationURLs(name: $name, urls: $urls) {
      name
    }
  }
`;

export const REMOVE_ADDONS_CONFIGURATION_URLS_MUTATION = gql`
  mutation removeAddonsConfigurationURLs($name: String!, $urls: [String!]!) {
    removeAddonsConfigurationURLs(name: $name, urls: $urls) {
      name
    }
  }
`;

interface CreateAddonsConfigurationVariables {
  name: string; 
  urls: string[]; 
  labels: ConfigurationLabels;
}

interface UpdateAddonsConfigurationVariables {
  name: string; 
  urls: string[]; 
  labels: ConfigurationLabels;
}

interface DeleteAddonsConfigurationVariables {
  name: string; 
}

interface AddAddonsConfigurationUrlsVariables {
  name: string;
  urls: string[];
}

interface RemoveAddonsConfigurationUrlsVariables {
  name: string;
  urls: string[];
}

const useMutations = () => {
  const createAddonsConfiguration = useMutation<{}, CreateAddonsConfigurationVariables>(CREATE_ADDONS_CONFIGURATION_MUTATION);
  const updateAddonsConfiguration = useMutation<{}, UpdateAddonsConfigurationVariables>(UPDATE_ADDONS_CONFIGURATION_MUTATION);
  const deleteAddonsConfiguration = useMutation<{}, DeleteAddonsConfigurationVariables>(DELETE_ADDONS_CONFIGURATION_MUTATION);
  const addAddonsConfigurationUrls = useMutation<{}, AddAddonsConfigurationUrlsVariables>(ADD_ADDONS_CONFIGURATION_URLS_MUTATION);
  const removeAddonsConfigurationUrls = useMutation<{}, RemoveAddonsConfigurationUrlsVariables>(REMOVE_ADDONS_CONFIGURATION_URLS_MUTATION);

  return {
    createAddonsConfiguration,
    updateAddonsConfiguration,
    deleteAddonsConfiguration,
    addAddonsConfigurationUrls,
    removeAddonsConfigurationUrls,
  };
};

const { Provider, Context } = createContainer(useMutations);
export { Provider as MutationsProvider, Context as MutationsService };
