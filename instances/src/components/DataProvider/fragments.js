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
    namespace
    parameters
    secret {
      name
      data
      namespace
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
    namespace
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
      namespace
      planSpec
      labels
      bindable
      status {
        type
        message
      }
      serviceClass {
        ${serviceClassGql}
        namespace
      }
      clusterServiceClass {
        ${serviceClassGql}
      }
      servicePlan {
        ${servicePlanGql}
        namespace
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
