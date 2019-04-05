import gql from 'graphql-tag';

export const CREATE_SERVICE_INSTANCE = gql`
  mutation CreateServiceInstance(
    $name: String!
    $namespace: String!
    $externalServiceClassName: String!
    $externalPlanName: String!
    $labels: [String!]!
    $parameterSchema: JSON
    $classClusterWide: Boolean!
    $planClusterWide: Boolean!
  ) {
    createServiceInstance(
      namespace: $namespace
      params: {
        name: $name
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
