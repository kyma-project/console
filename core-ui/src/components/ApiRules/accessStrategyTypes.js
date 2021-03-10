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

export const supportedMethodsList = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
];

export const hasValidMethods = rule => {
  // methods other than 'allow' require at least one method
  return (
    rule.accessStrategies[0].handler === allow.value || !!rule.methods.length
  );
};
