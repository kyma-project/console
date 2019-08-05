import gql from 'graphql-tag';
import createContainer from 'constate';
import { useMutation } from 'react-apollo-hooks';
import { ConfigurationLabels } from '../types';

export const CREATE_CLUSTER_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation createClusterAddonsConfiguration(
    $name: String!
    $urls: [String!]!
    $labels: Labels
  ) {
    createClusterAddonsConfiguration(
      name: $name
      urls: $urls
      labels: $labels
    ) {
      name
    }
  }
`;

export const UPDATE_CLUSTER_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation updateClusterAddonsConfiguration(
    $name: String!
    $urls: [String!]!
    $labels: Labels
  ) {
    updateClusterAddonsConfiguration(
      name: $name
      urls: $urls
      labels: $labels
    ) {
      name
    }
  }
`;

export const DELETE_CLUSTER_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation deleteClusterAddonsConfiguration($name: String!) {
    deleteClusterAddonsConfiguration(name: $name) {
      name
    }
  }
`;

export const ADD_CLUSTER_ADDONS_CONFIGURATION_URLS_MUTATION = gql`
  mutation addClusterAddonsConfigurationURLs(
    $name: String!
    $urls: [String!]!
  ) {
    addClusterAddonsConfigurationURLs(name: $name, urls: $urls) {
      name
    }
  }
`;

export const REMOVE_CLUSTER_ADDONS_CONFIGURATION_URLS_MUTATION = gql`
  mutation removeClusterAddonsConfigurationURLs(
    $name: String!
    $urls: [String!]!
  ) {
    removeClusterAddonsConfigurationURLs(name: $name, urls: $urls) {
      name
    }
  }
`;

export const RESYNC_CLUSTER_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation resyncClusterAddonsConfiguration($name: String!) {
    resyncClusterAddonsConfiguration(name: $name) {
      name
    }
  }
`;

interface CreateClusterAddonsConfigurationVariables {
  name: string;
  urls: string[];
  labels: ConfigurationLabels;
}

interface UpdateClusterAddonsConfigurationVariables {
  name: string;
  urls: string[];
  labels: ConfigurationLabels;
}

interface DeleteClusterAddonsConfigurationVariables {
  name: string;
}

interface AddClusterAddonsConfigurationUrlsVariables {
  name: string;
  urls: string[];
}

interface RemoveClusterAddonsConfigurationUrlsVariables {
  name: string;
  urls: string[];
}

const useMutations = () => {
  const createAddonsConfiguration = useMutation<
    {},
    CreateClusterAddonsConfigurationVariables
  >(CREATE_CLUSTER_ADDONS_CONFIGURATION_MUTATION);
  const updateAddonsConfiguration = useMutation<
    {},
    UpdateClusterAddonsConfigurationVariables
  >(UPDATE_CLUSTER_ADDONS_CONFIGURATION_MUTATION);
  const deleteAddonsConfiguration = useMutation<
    {},
    DeleteClusterAddonsConfigurationVariables
  >(DELETE_CLUSTER_ADDONS_CONFIGURATION_MUTATION);
  const addAddonsConfigurationUrls = useMutation<
    {},
    AddClusterAddonsConfigurationUrlsVariables
  >(ADD_CLUSTER_ADDONS_CONFIGURATION_URLS_MUTATION);
  const removeAddonsConfigurationUrls = useMutation<
    {},
    RemoveClusterAddonsConfigurationUrlsVariables
  >(REMOVE_CLUSTER_ADDONS_CONFIGURATION_URLS_MUTATION);

  return {
    createAddonsConfiguration: createAddonsConfiguration,
    updateAddonsConfiguration: updateAddonsConfiguration,
    deleteAddonsConfiguration: deleteAddonsConfiguration,
    addAddonsConfigurationUrls: addAddonsConfigurationUrls,
    removeAddonsConfigurationUrls: removeAddonsConfigurationUrls,
  };
};

const { Provider, Context } = createContainer(useMutations);
export { Provider as MutationsProvider, Context as MutationsService };
