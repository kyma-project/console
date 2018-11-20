import gql from 'graphql-tag';
import { SERVICE_INSTANCE_DETAILS_FRAGMENT } from '../DataProvider/fragments';

export const SERVICE_INSTANCES_DETAILS = gql`
  query allItems($environment: String!) {
    serviceInstances(environment: $environment) @client {
      ...serviceInstanceDetails
    }
  }
  ${SERVICE_INSTANCE_DETAILS_FRAGMENT}
`;
