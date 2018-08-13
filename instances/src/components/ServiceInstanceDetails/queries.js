import gql from 'graphql-tag';

export const SERVICE_INSTANCE_QUERY = gql`
  query ServiceInstance($environment: String!, $name: String!) {
    serviceInstance(environment: $environment, name: $name) {
      name
      environment
      servicePlanName
      status {
        type
        message
      }
      serviceClass {
        name
        displayName
        externalName
        description
        content
        asyncApiSpec
        apiSpec
      }
      servicePlan {
        name
        displayName
        externalName
        relatedServiceClassName
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
