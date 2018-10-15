import gql from 'graphql-tag';
import {
  SERVICE_INSTANCE_DETAILS_FRAGMENT,
  SERVICE_BINDING_USAGE_DETAILS_FRAGMENT,
  SERVICE_BINDING_DETAILS_FRAGMENT,
} from './fragments';

export const SERVICE_INSTANCE_EVENT_SUBSCRIPTION = gql`
  subscription ServiceInstanceEvent($environment: String!) {
    serviceInstanceEvent(environment: $environment) {
      type
      serviceInstance {
        ...serviceInstanceDetails
      }
    }
  }
  ${SERVICE_INSTANCE_DETAILS_FRAGMENT}
`;

export const SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION = gql`
  subscription ServiceBindingUsageEvent($environment: String!) {
    serviceBindingUsageEvent(environment: $environment) {
      type
      serviceBindingUsage {
        ...serviceBindingUsageDetails
      }
    }
  }
  ${SERVICE_BINDING_USAGE_DETAILS_FRAGMENT}
`;

export const SERVICE_BINDING_EVENT_SUBSCRIPTION = gql`
  subscription ServiceBinding($environment: String!) {
    serviceBindingEvent(environment: $environment) {
      type
      serviceBinding {
        ...serviceBindingDetails
      }
    }
  }
  ${SERVICE_BINDING_DETAILS_FRAGMENT}
`;
