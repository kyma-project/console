import gql from 'graphql-tag';

export const CREATE_SERVICE_INSTANCE = gql`
  mutation CreateServiceInstance(
    $name: String!
    $environment: String!
    $externalServiceClassName: String!
    $externalPlanName: String!
    $labels: [String!]!
    $parameterSchema: JSON
  ) {
    createServiceInstance(
      params: {
        name: $name
        environment: $environment
        externalServiceClassName: $externalServiceClassName
        externalPlanName: $externalPlanName
        labels: $labels
        parameterSchema: $parameterSchema
      }
    ) {
      name
    }
  }
`;
