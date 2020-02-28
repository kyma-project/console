import gql from 'graphql-tag';

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
  query APIrules($namespace: String!) {
    APIRules(namespace: $namespace) {
      name
    }
  }
`;
export const GET_API_RULE = gql`
  query APIrule($name: String!, $namespace: String!) {
    APIRule(name: $name, namespace: $namespace) {
      name
      rules {
        path
        methods
        accessStrategies {
          name
          config
        }
      }
      service {
        name
        host
        port
      }
    }
  }
`;

export const GET_COMPASS_APPLICATIONS = gql`
  query CompassApplications {
    applications {
      data {
        id
        providerName
        name
      }
    }
  }
`;

export const GET_IDP_PRESETS = gql`
  query IDPPresets {
    IDPPresets {
      name
      issuer
      jwksUri
    }
  }
`;

export const GET_KYMA_APPLICATIONS = gql`
  query KymaApplications {
    applications {
      name
      enabledInNamespaces
      status
    }
  }
`;

export const GET_APPLICATION = gql`
  query Application($name: String!) {
    application(name: $name) {
      name
      labels
      status
      description
      enabledInNamespaces
    }
  }
`;

export const GET_APPLICATION_COMPASS = gql`
  query Application($id: ID!) {
    application(id: $id) {
      id
      name
      providerName
      description
      apiDefinitions {
        data {
          id
          name
          description
          targetURL
          defaultAuth {
            credential {
              ... on OAuthCredentialData {
                clientId
                clientSecret
                url
              }
            }
          }
          spec {
            data
            format
            type
          }
          group
        }
      }
      eventDefinitions {
        data {
          id
          name
          description
          spec {
            data
            format
            type
          }
          group
        }
      }
    }
  }
`;

export const CHECK_APPLICATION_EXISTS = gql`
  query applications($filter: [LabelFilter!]) {
    applications(filter: $filter) {
      data {
        name
      }
    }
  }
`;

export const GET_APPLICATION_WITH_API_DEFINITIONS = gql`
  query Application($applicationId: ID!) {
    application(id: $applicationId) {
      name
      id
      apiDefinitions {
        data {
          id
          name
          description
          targetURL
          defaultAuth {
            credential {
              ... on OAuthCredentialData {
                clientId
                clientSecret
                url
              }
            }
          }
          spec {
            data
            format
            type
          }
          group
        }
        totalCount
      }
    }
  }
`;

export const GET_APPLICATION_WITH_EVENT_DEFINITIONS = gql`
  query Application($applicationId: ID!) {
    application(id: $applicationId) {
      name
      id
      eventDefinitions {
        data {
          id
          name
          description
          spec {
            data
            format
            type
          }
          group
        }
        totalCount
      }
    }
  }
`;

export const GET_TEMPLATES = gql`
  query applicationTemplates {
    applicationTemplates {
      data {
        id
        name
        applicationInput
        placeholders {
          name
          description
        }
      }
    }
  }
`;
