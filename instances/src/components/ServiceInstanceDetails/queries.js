import gql from 'graphql-tag';

const serviceClassQGL = `
  name
  displayName
  externalName
  description
  documentationUrl
  supportUrl
  content
  asyncApiSpec
  apiSpec
`;

const servicePlanQGL = `
  name
  displayName
  externalName
  description
  instanceCreateParameterSchema
`;

export const SERVICE_INSTANCE_QUERY = gql`
  query ServiceInstance($environment: String!, $name: String!) {
    serviceInstance(environment: $environment, name: $name) {
      name
      environment
      planSpec
      labels
      status {
        type
        message
      }
      serviceClass {
        ${serviceClassQGL}
        environment
      }
      clusterServiceClass {
        ${serviceClassQGL}
      }
      servicePlan {
        ${servicePlanQGL}
        environment
        relatedServiceClassName
      }
      clusterServicePlan {
        ${servicePlanQGL}
        relatedClusterServiceClassName
      }
      serviceBindings {
        items {
          name
          environment
          secret {
            name
            data
            environment
          }
          serviceInstanceName
        }
        stats {
          ready
          failed
          pending
          unknown
        }
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
