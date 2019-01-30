import styled from 'styled-components';
import { Tile, TileMedia, TileContent, Image as Img } from '@kyma-project/react-components';

export const ServiceClassInfoContentWrapper = styled(Tile)`
  && {
    background-color: #edeef0;
  }
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
    box-shadow: 0 5px 20px 0 rgba(50,54,58,.08);
    color: #32363a;
    font-size: 32px;
  }
`;

export const Image = styled(Img)`
  && {
    max-width: 40px;
    max-height: 40px;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
  margin-top: 32px;
  width: 100%;
  height: auto;
`;

export const LabelWrapper = styled.div`
  display: inline-block;
  margin: 0 10px 10px 0;
`;
