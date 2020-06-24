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
    service,
    status: { apiRuleStatus: { code: 'OK', desc: '' } },
  },
  {
    name: 'api-rule-2',
    service,
    status: { apiRuleStatus: { code: 'SKIPPED', desc: 'desc' } },
  },
];

export const apiRulesQuery = {
  request: {
    query: GET_API_RULES_FOR_SERVICE,
    variables: { namespace: namespaceId },
  },
  result: {
    data: { APIRules: apiRules },
  },
};
