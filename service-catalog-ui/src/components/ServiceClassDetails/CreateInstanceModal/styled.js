import styled from 'styled-components';
import { JsonSchemaForm as JsonSchemaFormComponent } from '@kyma-project/react-components';

export const Bold = styled.span`
  font-weight: 700;
  padding: 0 3px;
`;
export const Flex = styled.div`
  display: flex;
`;

export const NoFormText = styled.label`
  padding: 16px;
  display: block;
  box-sizing: border-box;
`;

export const JsonSchemaForm = styled(JsonSchemaFormComponent)`
  ul.error-detail {
    margin-left: 16px;
  }
`;
