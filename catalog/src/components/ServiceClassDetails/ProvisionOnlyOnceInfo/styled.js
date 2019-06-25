import styled from 'styled-components';
import {
  media,
  Panel,
  PanelHeader,
  PanelBody,
} from '@kyma-project/react-components';

export const ProvisionOnlyOnceInfoContentWrapper = styled(Panel)`
  && {
    border: 1px solid #eeeeef;
  
    border-left: ${props =>
      props.color ? '6px solid ' + props.color : 'none'};

    ${media.phone`
      grid-column: span 1;
    `};
  }
`;

export const ContentHeader = styled(PanelHeader)`
  && {
    color: rgb(50, 54, 58);
    box-sizing: border-box;
    font-size: 16px;
    font-weight: normal;
  }
`;

export const ContentDescription = styled(PanelBody)``;
