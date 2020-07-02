import { GET_API_RULES_FOR_SERVICE } from 'gql/queries';

export const namespaceId = 'namespace-id';

export const service = {
  name: 'service-name',
  host: 'service-host',
  port: 512,
  json: {
    spec: {
      ports: [{ port: 512 }],
    },
  },
};

export const apiRules = [
  {
    name: 'api-rule-1',
    spec: { service },
    status: { apiRuleStatus: { code: 'OK', description: '' } },
  },
  {
    name: 'api-rule-2',
    spec: { service },
    status: { apiRuleStatus: { code: 'SKIPPED', description: 'desc' } },
  },
];

export const apiRulesQuery = {
  request: {
    query: GET_API_RULES_FOR_SERVICE,
    variables: { namespace: namespaceId, serviceName: service.name },
  },
  result: {
    data: { APIRules: apiRules },
  },
};
