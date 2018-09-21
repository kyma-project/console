import gql from 'graphql-tag';

export const CREATE_SERVICE_INSTANCE = gql`
  mutation CreateServiceInstance(
    $name: String!
    $environment: String!
    $externalServiceClassName: String!
    $externalPlanName: String!
    $labels: [String!]!
    $parameterSchema: JSON
    $classClusterWide: Boolean!
    $planClusterWide: Boolean!
  ) {
    createServiceInstance(
      params: {
        name: $name
        environment: $environment
        classRef: {
          externalName: $externalServiceClassName
          clusterWide: $classClusterWide
        }
        planRef: {
          externalName: $externalPlanName
          clusterWide: $planClusterWide
        }
        labels: $labels
        parameterSchema: $parameterSchema
      }
    ) {
      name
    }
  }
`;
