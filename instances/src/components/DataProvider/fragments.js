import gql from 'graphql-tag';

export const serviceClassGql = `
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

export const servicePlanGql = `
  name
  displayName
  externalName
  description
  instanceCreateParameterSchema
  bindingCreateParameterSchema
`;

export const SERVICE_BINDING_DETAILS_FRAGMENT = gql`
  fragment serviceBindingDetails on ServiceBinding {
    name
    environment
    parameters
    secret {
      name
      data
      environment
    }
    serviceInstanceName
    status {
      type
      reason
      message
    }
  }
`;

export const SERVICE_BINDING_USAGE_DETAILS_FRAGMENT = gql`
  fragment serviceBindingUsageDetails on ServiceBindingUsage {
    name
    environment
    serviceBinding {
      name
      serviceInstanceName
      secret {
        name
        data
      }
    }
    status {
      type
      reason
      message
    }
    usedBy {
      name
      kind
    }
    parameters { 
      envPrefix {
        name
      }
    }
  }
`;

export const SERVICE_INSTANCE_DETAILS_FRAGMENT = gql`
  fragment serviceInstanceDetails on ServiceInstance {
      name
      environment
      planSpec
      labels
      status {
        type
        message
      }
      serviceClass {
        ${serviceClassGql}
        environment
      }
      clusterServiceClass {
        ${serviceClassGql}
      }
      servicePlan {
        ${servicePlanGql}
        environment
        relatedServiceClassName
      }
      clusterServicePlan {
        ${servicePlanGql}
        relatedClusterServiceClassName
      }
      serviceBindings {
        items {
            ...serviceBindingDetails
        }
        stats {
          ready
          failed
          pending
          unknown
        }
      }
      serviceBindingUsages {
        ...serviceBindingUsageDetails
      }
  }
  ${SERVICE_BINDING_DETAILS_FRAGMENT}
  ${SERVICE_BINDING_USAGE_DETAILS_FRAGMENT}
`;
