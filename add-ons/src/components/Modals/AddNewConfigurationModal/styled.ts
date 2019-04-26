import styled from 'styled-components';
import { Token } from 'fundamental-react';

export const AddedUrl = styled.div`
  margin: 6px 0;

  > .sap-icon--decline {
    cursor: pointer;
    color: #bb0000;
    float: right;
  }
`;

export const StyledToken = styled(Token)`
  &&& {
    background: #eef5fc;
    margin-right: 12px;
    margin-top: 12px;
  }
`;

export const AddLabelButtonWrapper = styled.div`
  margin-bottom: 16px;
`;
