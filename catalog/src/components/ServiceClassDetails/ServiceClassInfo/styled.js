import styled from 'styled-components';
import {
  TileMedia,
  TileContent,
  TileGrid,
  Image as Img,
} from '@kyma-project/react-components';

export const ServiceClassInfoContentWrapper = styled.div`
  background-color: #fff;
`;

export const ImagePlaceholder = styled(TileMedia)`
  && {
    position: relative;
    width: 90px;
    height: 90px;
    min-width: 90px;
    min-height: 90px;
    margin-right: 20px;
    line-height: 90px;
    text-align: center;
    border-radius: 4px;
    background-color: #fff;
    border: solid 1px rgba(63, 80, 96, 0.15);
    box-shadow: 0 5px 20px 0 rgba(50, 54, 58, 0.08);
    color: #32363a;
    font-size: 32px;
    padding: 0;
  }
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

export const ServiceClassInfoContent = styled(TileContent)`
  && {
    align-self: flex-start;
    padding: 0;

    > h2 {
      color: rgb(50, 54, 58);
      font-size: 16px;
      font-weight: normal;
    }
  }
`;

export const ServiceTitle = styled.h3`
  font-family: '72';
  font-size: 16px;
  font-weight: normal;
  color: #32363a;
  margin: 0;
`;

export const ServiceProvider = styled.p`
  font-family: '72';
  font-size: 14px;
  font-weight: 300;
  color: #b2b9bf;
  margin: 5px 0;
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
