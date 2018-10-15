import gql from 'graphql-tag';

import { SERVICE_INSTANCE_DETAILS_FRAGMENT } from '../DataProvider/fragments';

export const SERVICE_INSTANCES_QUERY = gql`
  query ServiceInstances($environment: String!) {
    serviceInstances(environment: $environment) {
      ...serviceInstanceDetails
    }
  }
  ${SERVICE_INSTANCE_DETAILS_FRAGMENT}
`;
