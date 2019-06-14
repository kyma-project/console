import styled from 'styled-components';
import { TileGrid, Image as Img } from '@kyma-project/react-components';

export const ServiceClassInfoContentWrapper = styled.div`
  background-color: #fff;
`;

export const Image = styled(Img)`
  && {
    align-self: center;
  }
`;

export const ServiceClassHeaderTileGrid = styled(TileGrid)`
  > div {
    border: none;
  }
`;

export const ExternalLink = styled.a`
  font-family: '72';
  font-size: 14px;
  font-weight: normal;
  color: #167ee6;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;

export const LabelsWrapper = styled.div`
  margin-top: 12px;
  width: 100%;
  height: auto;
`;

export const LabelWrapper = styled.div`
  display: inline-block;
  margin: 0 10px 10px 0;
`;
