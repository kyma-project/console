import gql from 'graphql-tag';

export const GET_LABEL_DEFINITIONS = gql`
  query {
    labelDefinitions {
      key
      schema
    }
  }
`;

export const GET_LABEL_DEFINITION = gql`
  query($key: String!) {
    labelDefinition(key: $key) {
      key
      schema
    }
  }
`;

export const UPDATE_LABEL_DEFINITION = gql`
  mutation UpdateLabelDefinition($in: LabelDefinitionInput!) {
    updateLabelDefinition(in: $in) {
      key
      schema
    }
  }
`;

export const DELETE_LABEL_DEFINITION = gql`
  mutation DeleteLabelDefinition($key: String!) {
    deleteLabelDefinition(key: $key) {
      key
      schema
    }
  }
`;
