import styled from 'styled-components';
import {
  Panel,
  PanelActions,
  PanelHeader,
  PanelBody,
  PanelFooter,
  Tile,
  TileMedia,
  TileContent,
  Image,
} from '@kyma-project/react-components';

export const CardWrapper = styled.div`
  box-sizing: border-box;
  padding: 10px 0;
  width: 100%;
  flex: 0 1 33.33%;
`;

export const CardContent = styled(Panel)`
  && {
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    height: 100%;
    padding: 20px;
    transition: box-shadow 0.125s ease-in;
    box-shadow: 0 5px 20px 0 rgba(50, 54, 58, 0.08);

    &:hover {
      box-shadow: 0 0 5px 0 rgba(106, 109, 112, 0.4);
      cursor: pointer;
    }
  }
`;

export const CardTop = styled(PanelHeader)`
  && {
    display: flex;
    border-bottom: none;
    justify-content: flex-start;
    padding: 0;
    text-align: left;
    margin-bottom: 20px;
  }
`;

export const CardThumbnail = styled(TileMedia)`
  && {
    position: relative;
    width: 45px;
    height: 45px;
    min-width: 45px;
    min-height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 4px;
    background-color: #f3f4f5;
    border: solid 1px rgba(63, 80, 96, 0.15);
    color: #32363a;
    font-size: 20px;
  }
`;

export const CardImage = styled(Image)`
  && {
    max-width: 27px;
    max-height: 27px;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

export const CardHeader = styled(Tile)`
  && {
    width: 100%;
  }
`;

export const CardHeaderContent = styled(TileContent)`
  && {
    padding: 0;
    margin-left: 20px;
    align-self: flex-start;

    > h2 {
      font-size: 16px;
      color: rgb(50, 54, 58);
      font-weight: normal;
    }
  }
`;

export const CardIndicator = styled(PanelActions)`
  && {
    margin: 0;
    margin-left: 10px;
    align-self: flex-start;
    font-family: '72';
    position: relative;
  }
`;

export const CardIndicatorGeneral = styled.div`
  && {
    padding: 2px 6px;
    background-color: ${props =>
      props.active === 'true' ? '#0a6ed1' : '#eeeeef'};
    color: ${props => (props.active === 'true' ? '#ffffff' : '#515559')};
    border-radius: 2px;
    font-size: 12px;
  }
`;
export const CardIndicatorProvisionOnce = styled(CardIndicatorGeneral)`
  && {
    ${props =>
      props.provisionOnce &&
      `
      padding: 0;
      width: 28px;
      height: 28px;
      line-height: 28px;
      font-size: 10px;
      text-align: center;
      border-radius: 4px;

      :before {
        position: absolute;
        top: 55%;
        left: 50%;
        font-size:16px;
        content: '\uE010';
        font-family: SAP-icons;
        font-style: normal;
        font-weight: 400;
        text-align: center;
        display: inline-block;
        text-decoration: inherit;
        text-transform: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        speak: none;
        -webkit-transform: scaleY(-1) translate(-50%, 50%);
        -moz-transform: scaleY(-1) translate(-50%, 50%);
        -ms-transform: scaleY(-1) translate(-50%, 50%);
        -o-transform: scaleY(-1) translate(-50%, 50%);
        transform: scaleY(-1) translate(-50%, 50%);
        filter: flipv;
      }
    `};
  }
`;

export const CardDescription = styled(PanelBody)`
  && {
    flex: 1;
    border-top: none;
    padding: 0;
    text-align: left;
    margin-bottom: 20px;
  }
`;

export const CardFooter = styled(PanelFooter)`
  && {
    border-top: none;
    justify-content: flex-start;
    padding: 0;
  }
`;

export const CardLabelWrapper = styled.div`
  display: inline-block;
  margin: 8px 8px 0 0;
`;
