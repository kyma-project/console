import gql from 'graphql-tag';

import { SERVICE_INSTANCE_DETAILS_FRAGMENT } from '../DataProvider/fragments';

export const SERVICE_INSTANCES_QUERY = gql`
  query ServiceInstances($namespace: String!) {
    serviceInstances(namespace: $namespace) {
      ...serviceInstanceDetails
    }
  }
  ${SERVICE_INSTANCE_DETAILS_FRAGMENT}
`;
