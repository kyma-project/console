import gql from 'graphql-tag';
import { SERVICE_INSTANCE_DETAILS_FRAGMENT } from './fragments';

const getServiceInstanceDetails = gql`
  query($name: String!, $namespace: String!) {
    serviceInstance(name: $name, namespace: $namespace) {
      ...serviceInstanceDetails
    }
  }
  ${SERVICE_INSTANCE_DETAILS_FRAGMENT}
`;

const getAllServiceInstances = gql`
  query ServiceInstances($namespace: String!) {
    serviceInstances(namespace: $namespace) {
      ...serviceInstanceDetails
    }
  }
  ${SERVICE_INSTANCE_DETAILS_FRAGMENT}
`;

export { getAllServiceInstances, getServiceInstanceDetails };
