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

const useMutations = () => {
  const createAddonsConfiguration = useMutation<
    {},
    { name: string; urls: string[]; labels: ConfigurationLabels }
  >(CREATE_ADDONS_CONFIGURATION_MUTATION);
  const updateAddonsConfiguration = useMutation<
    {},
    { name: string; urls: string[]; labels: ConfigurationLabels }
  >(UPDATE_ADDONS_CONFIGURATION_MUTATION);
  const deleteAddonsConfiguration = useMutation<{}, { name: string }>(
    DELETE_ADDONS_CONFIGURATION_MUTATION,
  );
  const addAddonsConfigurationUrls = useMutation<
    {},
    { name: string; urls: string[] }
  >(ADD_ADDONS_CONFIGURATION_URLS_MUTATION);
  const removeAddonsConfigurationUrls = useMutation<
    {},
    { name: string; urls: string[] }
  >(REMOVE_ADDONS_CONFIGURATION_URLS_MUTATION);

  return {
    createAddonsConfiguration,
    updateAddonsConfiguration,
    deleteAddonsConfiguration,
    addAddonsConfigurationUrls,
    removeAddonsConfigurationUrls,
  };
};

export default createContainer(useMutations);
