import { useContext } from 'react';
import gql from 'graphql-tag';
import createContainer from 'constate';
import { useMutation, MutationTuple } from '@apollo/react-hooks';
import { MutationFunctionOptions, ExecutionResult } from '@apollo/react-common';
import { GlobalService } from '@kyma-project/common';

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

export const CREATE_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation createAddonsConfiguration(
    $name: String!
    $namespace: String!
    $urls: [String!]!
    $labels: Labels
  ) {
    createAddonsConfiguration(
      name: $name
      namespace: $namespace
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

export const UPDATE_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation updateAddonsConfiguration(
    $name: String!
    $namespace: String!
    $urls: [String!]!
    $labels: Labels
  ) {
    updateAddonsConfiguration(
      name: $name
      namespace: $namespace
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

export const DELETE_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation deleteAddonsConfiguration($name: String!, $namespace: String!) {
    deleteAddonsConfiguration(name: $name, namespace: $namespace) {
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

export const ADD_ADDONS_CONFIGURATION_URLS_MUTATION = gql`
  mutation addAddonsConfigurationURLs(
    $name: String!
    $namespace: String!
    $urls: [String!]!
  ) {
    addAddonsConfigurationURLs(
      name: $name
      namespace: $namespace
      urls: $urls
    ) {
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

export const REMOVE_ADDONS_CONFIGURATION_URLS_MUTATION = gql`
  mutation removeAddonsConfigurationURLs(
    $name: String!
    $namespace: String!
    $urls: [String!]!
  ) {
    removeAddonsConfigurationURLs(
      name: $name
      namespace: $namespace
      urls: $urls
    ) {
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

export const RESYNC_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation resyncAddonsConfiguration($name: String!, $namespace: String!) {
    resyncClusterAddonsConfiguration(name: $name, namespace: $namespace) {
      name
    }
  }
`;

interface CreateAddonsConfigurationVariables {
  name: string;
  urls: string[];
  labels: ConfigurationLabels;
  namespace?: string;
}

interface UpdateAddonsConfigurationVariables {
  name: string;
  urls: string[];
  labels: ConfigurationLabels;
  namespace?: string;
}

interface DeleteAddonsConfigurationVariables {
  name: string;
  namespace?: string;
}

interface AddAddonsConfigurationUrlsVariables {
  name: string;
  urls: string[];
  namespace?: string;
}

interface RemoveAddonsConfigurationUrlsVariables {
  name: string;
  urls: string[];
  namespace?: string;
}

interface ResyncAddonsConfigurationVariables {
  name: string;
  namespace?: string;
}

const mutation = (namespace?: string) => <TData, TVariables>(
  tuple: MutationTuple<TData, TVariables>,
): MutationTuple<TData, TVariables> => {
  const [fn, result] = tuple;
  const newFn = (
    options?: MutationFunctionOptions<TData, TVariables>,
  ): Promise<void | ExecutionResult<TData>> => {
    const opts = options || {};

    let variables = options && options.variables;
    if (variables && Object.keys(variables) && namespace) {
      variables = {
        ...variables,
        namespace,
      };
    }

    return fn({
      ...opts,
      variables,
    });
  };

  return [newFn, result];
};

const useMutations = () => {
  const { currentNamespace } = useContext(GlobalService);
  const mutationFactory = mutation(currentNamespace);

  const createAddonsConfiguration = mutationFactory<
    {},
    CreateAddonsConfigurationVariables
  >(
    useMutation(
      currentNamespace
        ? CREATE_ADDONS_CONFIGURATION_MUTATION
        : CREATE_CLUSTER_ADDONS_CONFIGURATION_MUTATION,
    ),
  );

  const updateAddonsConfiguration = mutationFactory(
    useMutation<{}, UpdateAddonsConfigurationVariables>(
      currentNamespace
        ? UPDATE_ADDONS_CONFIGURATION_MUTATION
        : UPDATE_CLUSTER_ADDONS_CONFIGURATION_MUTATION,
    ),
  );

  const deleteAddonsConfiguration = mutationFactory(
    useMutation<{}, DeleteAddonsConfigurationVariables>(
      currentNamespace
        ? DELETE_ADDONS_CONFIGURATION_MUTATION
        : DELETE_CLUSTER_ADDONS_CONFIGURATION_MUTATION,
    ),
  );

  const addAddonsConfigurationUrls = mutationFactory(
    useMutation<{}, AddAddonsConfigurationUrlsVariables>(
      currentNamespace
        ? ADD_ADDONS_CONFIGURATION_URLS_MUTATION
        : ADD_CLUSTER_ADDONS_CONFIGURATION_URLS_MUTATION,
    ),
  );

  const removeAddonsConfigurationUrls = mutationFactory(
    useMutation<{}, RemoveAddonsConfigurationUrlsVariables>(
      currentNamespace
        ? REMOVE_ADDONS_CONFIGURATION_URLS_MUTATION
        : REMOVE_CLUSTER_ADDONS_CONFIGURATION_URLS_MUTATION,
    ),
  );

  const resyncAddonsConfiguration = mutationFactory(
    useMutation<{}, ResyncAddonsConfigurationVariables>(
      currentNamespace
        ? RESYNC_ADDONS_CONFIGURATION_MUTATION
        : RESYNC_CLUSTER_ADDONS_CONFIGURATION_MUTATION,
    ),
  );

  return {
    createAddonsConfiguration,
    updateAddonsConfiguration,
    deleteAddonsConfiguration,
    addAddonsConfigurationUrls,
    removeAddonsConfigurationUrls,
    resyncAddonsConfiguration,
  };
};

const { Provider, Context } = createContainer(useMutations);
export { Provider as MutationsProvider, Context as MutationsService };
