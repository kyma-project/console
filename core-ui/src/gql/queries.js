import gql from 'graphql-tag';

export const GET_NAMESPACE = gql`
  query Namespace($name: String!) {
    namespace(name: $name) {
      name
      labels
      applications
      pods {
        name
        status
      }
      deployments {
        name
        status {
          replicas
          readyReplicas
        }
      }
    }
  }
`;

export const GET_NAMESPACES = gql`
  query Namespaces(
    $showSystemNamespaces: Boolean
    $withInactiveStatus: Boolean
  ) {
    namespaces(
      withSystemNamespaces: $showSystemNamespaces
      withInactiveStatus: $withInactiveStatus
    ) {
      name
      labels
      status
      pods {
        status
      }
      applications
      isSystemNamespace
    }
  }
`;

export const GET_NAMESPACES_NAMES = gql`
  query Namespaces($showSystemNamespaces: Boolean) {
    namespaces(
      withSystemNamespaces: $showSystemNamespaces
      withInactiveStatus: false
    ) {
      name
    }
  }
`;

export const GET_SERVICE = gql`
  query Service($name: String!, $namespace: String!) {
    service(name: $name, namespace: $namespace) {
      name
      json
      labels
      clusterIP
      UID
    }
  }
`;

export const GET_LAMBDAS = gql`
  query Functions($namespace: String!) {
    functions(namespace: $namespace) {
      name
      namespace
      labels
      runtime
      size
      status
      serviceBindingUsages {
        name
      }
    }
  }
`;

export const GET_LAMBDA = gql`
  query Function($name: String!, $namespace: String!) {
    function(name: $name, namespace: $namespace) {
      name
      namespace
      UID
      labels
      runtime
      size
      status
      content
      dependencies
      serviceBindingUsages {
        name
        parameters {
          envPrefix {
            name
          }
        }
        serviceBinding {
          name
          serviceInstanceName
          secret {
            name
            data
          }
        }
      }
    }
  }
`;

export const GET_SERVICE_INSTANCES = gql`
  query ServiceInstances($namespace: String!, $status: InstanceStatusType) {
    serviceInstances(namespace: $namespace, status: $status) {
      name
      bindable
      servicePlan {
        bindingCreateParameterSchema
      }
      serviceBindings {
        items {
          name
          parameters
          secret {
            name
            data
          }
        }
      }
    }
  }
`;

export const GET_SERVICES = gql`
  query Services($namespace: String!, $excludedLabels: [String!]) {
    services(namespace: $namespace, excludedLabels: $excludedLabels) {
      name
      ports {
        port
      }
    }
  }
`;

export const GET_API_RULES = gql`
  query APIRules($namespace: String!, $serviceName: String) {
    APIRules(namespace: $namespace, serviceName: $serviceName) {
      name
      generation
      spec {
        rules {
          path
          methods
          accessStrategies {
            name
            config
          }
        }
        service {
          host
          name
          port
        }
      }
      status {
        apiRuleStatus {
          code
          description
        }
      }
    }
  }
`;

export const GET_API_RULE = gql`
  query APIRule($name: String!, $namespace: String!) {
    APIRule(name: $name, namespace: $namespace) {
      name
      generation
      spec {
        rules {
          path
          methods
          accessStrategies {
            name
            config
          }
        }
        service {
          host
          name
          port
        }
      }
      status {
        apiRuleStatus {
          code
          description
        }
      }
    }
  }
`;

export const GET_OAUTH_CLIENTS = gql`
  query oAuthClients($namespace: String!) {
    oAuth2Clients(namespace: $namespace) {
      name
      error {
        code
        description
      }
      spec {
        grantTypes
        responseTypes
      }
    }
  }
`;

export const GET_OAUTH_CLIENT = gql`
  query oAuthClient($namespace: String!, $name: String!) {
    oAuth2Client(namespace: $namespace, name: $name) {
      name
      generation
      error {
        code
        description
      }
      spec {
        grantTypes
        responseTypes
        scope
        secretName
      }
    }
  }
`;

export const GET_SECRET = gql`
  query secret($namespace: String!, $name: String!) {
    secret(namespace: $namespace, name: $name) {
      data
    }
  }
`;
