export const lambdaNoContent = {
  name: 'testname',
  namespace: 'testnamespace',
  status: 'ERROR',
  labels: {},
  size: 'M',
  runtime: 'nodejs8',
  dependencies: 'test dependencies',
};

export const lambda = {
  ...lambdaNoContent,
  content: 'test content',
};
