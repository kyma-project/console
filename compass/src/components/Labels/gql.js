import gql from 'graphql-tag';

export const GET_LABEL_NAMES = gql`
  query allLabels {
    labelDefinitions {
      key
    }
  }
`;

export const CREATE_LABEL = gql`
  mutation createLabelDefinition($in: LabelDefinitionInput!) {
    createLabelDefinition(in: $in) {
      key
      schema
    }
  }
`;
