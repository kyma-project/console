import gql from 'graphql-tag';
import {
  SERVICE_INSTANCE_DETAILS_FRAGMENT,
  SERVICE_BINDING_USAGE_DETAILS_FRAGMENT,
  SERVICE_BINDING_DETAILS_FRAGMENT,
} from './fragments';

export const SERVICE_INSTANCE_EVENT_SUBSCRIPTION = gql`
  subscription ServiceInstanceEvent($namespace: String!) {
    serviceInstanceEvent(namespace: $namespace) {
      type
      serviceInstance {
        ...serviceInstanceDetails
      }
    }
  }
  ${SERVICE_INSTANCE_DETAILS_FRAGMENT}
`;

export const SERVICE_BINDING_USAGE_EVENT_SUBSCRIPTION = gql`
  subscription ServiceBindingUsageEvent($namespace: String!) {
    serviceBindingUsageEvent(namespace: $namespace) {
      type
      serviceBindingUsage {
        ...serviceBindingUsageDetails
      }
    }
  }
  ${SERVICE_BINDING_USAGE_DETAILS_FRAGMENT}
`;

export const SERVICE_BINDING_EVENT_SUBSCRIPTION = gql`
  subscription ServiceBinding($namespace: String!) {
    serviceBindingEvent(namespace: $namespace) {
      type
      serviceBinding {
        ...serviceBindingDetails
      }
    }
  }
  ${SERVICE_BINDING_DETAILS_FRAGMENT}
`;
