const allow = {
  value: 'allow',
  displayName: 'Allow',
  methodsIrrelevant: true,
};
const noop = {
  value: 'noop',
  displayName: 'noop',
};
const jwt = {
  value: 'jwt',
  displayName: 'JWT',
};
const oauth2_introspection = {
  value: 'oauth2_introspection',
  displayName: 'OAuth2',
};

const accessStrategyTypes = { noop, allow, oauth2_introspection, jwt };

export default accessStrategyTypes;
export const usesMethods = strategyType =>
  !accessStrategyTypes[strategyType].methodsIrrelevant;
