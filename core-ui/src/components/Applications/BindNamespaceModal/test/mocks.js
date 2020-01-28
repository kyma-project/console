import { GET_NAMESPACES_NAMES } from 'gql/queries';

export const exampleAppName = 'example-app-name';

export const exampleBoundNamespaces = ['example-name-1'];

export const exampleNamespaces = [
  {
    name: 'example-name-1',
  },
  {
    name: 'example-name-2',
  },
];

export const mockNamespaces = {
  request: {
    query: GET_NAMESPACES_NAMES,
    variables: {
      showSystemNamespaces: false,
    },
  },
  result: {
    data: {
      namespaces: exampleNamespaces,
    },
  },
};

export const mockNamespacesError = {
  request: {
    query: GET_NAMESPACES_NAMES,
    variables: {
      showSystemNamespaces: false,
    },
  },
  error: Error('Error'),
};
