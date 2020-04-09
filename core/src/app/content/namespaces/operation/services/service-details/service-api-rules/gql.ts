
export const GET_API_RULES = `query APIRules($namespace: String!) {
  APIRules(namespace: $namespace) {
    name
    service {
      host
      name
      port
    }
    status {
      apiRuleStatus {
        code
        desc
      }
    }
  }
}`;

export const DELETE_API_RULE = `mutation deleteAPIRule($name: String!, $namespace: String!) {
  deleteAPIRule(name: $name, namespace: $namespace) {
    name
  }
}`;