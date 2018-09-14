import gql from 'graphql-tag';

export const SERVICE_INSTANCE_QUERY = gql`
  query ServiceInstance($environment: String!, $name: String!) {
    serviceInstance(environment: $environment, name: $name) {
      name
      environment
      servicePlanName
      servicePlanSpec
      labels
      status {
        type
        message
      }
      serviceClass {
        name
        displayName
        externalName
        description
        documentationUrl
        supportUrl
        content
        asyncApiSpec
        apiSpec
      }
      servicePlan {
        name
        displayName
        externalName
        relatedServiceClassName
        description
        instanceCreateParameterSchema
      }
      serviceBindings {
        name
        environment
        secret {
          name
          data
          environment
        }
        serviceInstanceName
      }
      serviceBindingUsages {
        name
        environment
        serviceBinding {
          name
          secret {
            name
            data
          }
        }
        usedBy {
          name
          kind
        }
      }
    }
  }
`;
