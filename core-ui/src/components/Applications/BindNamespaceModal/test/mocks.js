import { GET_NAMESPACES } from 'gql/queries';

export const exampleAppName = 'example-app-name';

export const exampleBoundNamespaces = ['example-name-1'];

const exampleNamespaces = [
  {
    name: 'example-name-1',
  },
  {
    name: 'example-name-2',
  },
];

export const mockNamespaces = {
  request: {
    query: GET_NAMESPACES,
    variables: {
      showSystemNamespaces: false,
    },
  },
  result: {
    namespaces: exampleNamespaces,
  },
};
