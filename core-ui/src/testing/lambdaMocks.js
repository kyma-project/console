const lambda1 = {
  name: 'demo',
  namespace: 'production',
  labels: {
    foo: 'bar',
    test: 'test',
  },
  runtime: 'nodejs8',
  size: 'S',
  status: 'Error',
  __typename: 'Function',
};

const lambda2 = {
  name: 'demo2',
  namespace: 'production',
  labels: {
    foo: 'bar',
  },
  runtime: 'nodejs8',
  size: 'S',
  status: 'Deploying',
  __typename: 'Function',
};

const deletedLambda1 = {
  name: 'demo',
  __typename: 'Function',
};

export { lambda1, lambda2, deletedLambda1 };
