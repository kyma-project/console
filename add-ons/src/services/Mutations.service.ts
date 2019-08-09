import gql from 'graphql-tag';
import createContainer from 'constate';
import { FetchResult } from "apollo-link";
import { useMutation, MutationFn, BaseMutationHookOptions } from 'react-apollo-hooks';

import appInitializer from '../core/app-initializer';
import { ConfigurationLabels } from "../types";

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
  mutation deleteClusterAddonsConfiguration(
    $name: String!
  ) {
    deleteClusterAddonsConfiguration(
      name: $name
    ) {
      name
    }
  }
`;

export const DELETE_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation deleteAddonsConfiguration(
    $name: String!
    $namespace: String!
  ) {
    deleteAddonsConfiguration(
      name: $name
      namespace: $namespace
    ) {
      name
    }
  }
`;

export const ADD_CLUSTER_ADDONS_CONFIGURATION_URLS_MUTATION = gql`
  mutation addClusterAddonsConfigurationURLs(
    $name: String!
    $urls: [String!]!
  ) {
    addClusterAddonsConfigurationURLs(
      name: $name
      urls: $urls
    ) {
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
    removeClusterAddonsConfigurationURLs(
      name: $name
      urls: $urls
    ) {
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
  mutation resyncClusterAddonsConfiguration(
    $name: String!
  ) {
    resyncClusterAddonsConfiguration(
      name: $name
    ) {
      name
    }
  }
`;

export const RESYNC_ADDONS_CONFIGURATION_MUTATION = gql`
  mutation resyncAddonsConfiguration(
    $name: String!
    $namespace: String!
  ) {
    resyncClusterAddonsConfiguration(
      name: $name
      namespace: $namespace
    ) {
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

const mutationFactory = (namespace?: string) => <TData, TVariables>(fn: MutationFn<TData, TVariables>) => (options?: BaseMutationHookOptions<TData, TVariables>): Promise<FetchResult<TData>> => {
  const opts = options || {};

  let variables = (options && options.variables);
  if (variables && Object.keys(variables) && namespace) {
    variables = {
      ...variables,
      namespace
    }
  }

  return fn({
    ...opts,
    variables,
  });
} 

const useMutations = () => {
  const currentNamespace = appInitializer.getCurrentNamespace();
  const mutation = mutationFactory(currentNamespace);

  const createAddonsConfiguration = mutation(
    useMutation<
      {},
      CreateAddonsConfigurationVariables
    >(
      currentNamespace
        ? CREATE_ADDONS_CONFIGURATION_MUTATION
        : CREATE_CLUSTER_ADDONS_CONFIGURATION_MUTATION,
    ),
  );

  const updateAddonsConfiguration = mutation(
    useMutation<
      {},
      UpdateAddonsConfigurationVariables
    >(
      currentNamespace
        ? UPDATE_ADDONS_CONFIGURATION_MUTATION
        : UPDATE_CLUSTER_ADDONS_CONFIGURATION_MUTATION,
    )
  );

  const deleteAddonsConfiguration = mutation(
    useMutation<
      {},
      DeleteAddonsConfigurationVariables
    >(
      currentNamespace
        ? DELETE_ADDONS_CONFIGURATION_MUTATION
        : DELETE_CLUSTER_ADDONS_CONFIGURATION_MUTATION,
    )
  );

  const addAddonsConfigurationUrls = mutation(
    useMutation<
      {},
      AddAddonsConfigurationUrlsVariables
    >(
      currentNamespace
        ? ADD_ADDONS_CONFIGURATION_URLS_MUTATION
        : ADD_CLUSTER_ADDONS_CONFIGURATION_URLS_MUTATION,
    )
  );

  const removeAddonsConfigurationUrls = mutation(
    useMutation<
      {},
      RemoveAddonsConfigurationUrlsVariables
    >(
      currentNamespace
        ? REMOVE_ADDONS_CONFIGURATION_URLS_MUTATION
        : REMOVE_CLUSTER_ADDONS_CONFIGURATION_URLS_MUTATION,
    )
  );

  const resyncAddonsConfiguration = mutation(
    useMutation<
      {},
      ResyncAddonsConfigurationVariables
    >(
      currentNamespace
        ? RESYNC_ADDONS_CONFIGURATION_MUTATION
        : RESYNC_CLUSTER_ADDONS_CONFIGURATION_MUTATION,
    )
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
