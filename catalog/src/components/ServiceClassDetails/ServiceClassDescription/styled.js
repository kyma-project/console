import styled from 'styled-components';
import { Panel, PanelHeader, PanelBody } from '@kyma-project/react-components';

export const ServiceClassDescriptionContentWrapper = styled(Panel)`
  && {
    margin-bottom: 20px;
  }
`;

export const ContentHeader = styled(PanelHeader)`
  && {
    color: rgb(50,54,58);
    box-sizing: border-box;
    font-size: 16px;
    font-weight: normal;
  }
`;

export const ContentDescription = styled(PanelBody)``;
