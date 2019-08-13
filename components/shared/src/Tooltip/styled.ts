import styled from 'styled-components';
import { TooltipType, TooltipOrientation } from './index';

interface TooltipContainerProps {
  minWidth?: string;
  maxWidth?: string;
  type?: TooltipType;
  light?: boolean;
  orientation?: TooltipOrientation;
  show?: boolean;
}

export const TooltipContainer = styled.div<TooltipContainerProps>`
  position: absolute;
  box-sizing: border-box;
  z-index: 99;
  min-width: ${props => (props.minWidth ? props.minWidth : '120px')};
  max-width: ${props => (props.maxWidth ? props.maxWidth : '420px')};
  background: ${props =>
    props.type === TooltipType.STANDARD && !props.light ? '#32363a' : '#fff'};
  font-size: ${props =>
    props.type === TooltipType.STANDARD ? '11px' : '12px'};
  line-height: ${props =>
    props.type === TooltipType.STANDARD ? '11px' : '12px'};
  color: ${props =>
    props.type === TooltipType.STANDARD && !props.light ? '#fff' : '#32363b'};
  filter: drop-shadow(rgba(0, 0, 0, 0.12) 0 0px 2px);
  box-shadow: 0 0 4px 0 #00000026, 0 12px 20px 0 #00000019;
  border-radius: 3px;
  border-left: ${props => {
    let color = '';
    switch (props.type) {
      case TooltipType.INFO:
        color = '#0b74de';
        break;
      case TooltipType.WARNING:
        color = '#ffeb3b';
        break;
      case TooltipType.POSITIVE:
        color = '#4caf50';
        break;
      case TooltipType.NEGATIVE:
        color = '#f44336';
        break;
      default:
        color = 'none';
    }
    return `6px solid ${color}`;
  }};
  ${props => (props.orientation === 'top' ? 'bottom: 100%;' : 'top: 100%')};
  right: 50%;

  ${props => (props.type === TooltipType.LIGHT && 'left: 0;') || 'right: 50%'};
  transform: translateX(
    ${props =>
      (props.type === TooltipType.STANDARD && '50%') ||
      (props.type === TooltipType.LIGHT && '-40px') ||
      '40px'}
  );
  visibility: ${props => (props.show ? 'visibility' : 'hidden')};
  opacity: ${props => (props.show ? '1' : '0')};
  ${props => {
    switch (props.orientation) {
      case 'bottom':
        return `margin-top: ${
          props.type === TooltipType.STANDARD ? '8px' : '16px'
        }`;
      default:
        return `margin-bottom: ${
          props.type === TooltipType.STANDARD ? '8px' : '16px'
        }`;
    }
  }};

  &:after {
    border: ${props => (props.type === TooltipType.STANDARD ? '6px' : '10px')}
      solid;
    border-color: ${props => {
      switch (props.orientation) {
        case 'bottom':
          return `transparent transparent ${
            props.type === TooltipType.STANDARD ? '#32363b' : '#fff'
          }`;
        default:
          return `${
            props.type === TooltipType.STANDARD ? '#32363b' : '#fff'
          } transparent transparent`;
      }
    }};
    content: '';
    ${props =>
      (props.type === TooltipType.STANDARD && 'right: 50%;') ||
      (props.type === TooltipType.LIGHT && 'left: 48px;') ||
      'right: 25px'};
    ${props =>
      props.type === TooltipType.STANDARD ? 'transform: translateX(6px)' : ''};
    margin-left: -10px;
    position: absolute;
    ${props =>
      props.orientation === TooltipOrientation.TOP
        ? 'top: 100%; margin-top: -1px;'
        : 'bottom: 100%; margin-bottom: -1px;'};
  }
`;

interface TooltipWrapperProps {
  wrapperStyles?: string;
  type?: string;
}

export const TooltipWrapper = styled.div<TooltipWrapperProps>`
  font-family: '72';
  position: relative;
  display: inline-block;

  ${props => (props.wrapperStyles ? props.wrapperStyles : '')}

  &:hover ${TooltipContainer} {
    visibility: visible;
    opacity: 1;
  }
`;

interface TooltipContentProps {
  type?: TooltipType;
}

export const TooltipContent = styled.div<TooltipContentProps>`
  display: block;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: ${props =>
    props.type === TooltipType.STANDARD ? 'center' : 'left'};
  padding: ${props =>
    props.type === TooltipType.STANDARD ? '6px 10px' : '12px 14px'};
`;

interface TooltipHeaderProps {
  type?: TooltipType;
}

export const TooltipHeader = styled.div<TooltipHeaderProps>`
  border-bottom: 1px solid rgba(204, 204, 204, 0.3);
  font-weight: bold;
  text-align: left;
  position: relative;
  padding: 12px 14px;
  box-sizing: border-box;

  &:after {
    ${props => {
      switch (props.type) {
        case TooltipType.INFO:
          return "content: '\uE1C3'; color: #0b74de;";
        case TooltipType.WARNING:
          return "content: '\uE053'; color: #ffeb3b;";
        case TooltipType.POSITIVE:
          return "content: '\uE1C1'; color: #4caf50;";
        case TooltipType.NEGATIVE:
          return "content: '\uE0B1'; color: #f44336;";
        default:
          return "content: '';";
      }
    }};
    position: absolute;
    display: block;
    top: 12px;
    right: 14px;
    box-sizing: border-box;
    font-family: SAP-Icons;
  }
`;

export const TooltipFooter = styled.div`
  border-bottom: 1px solid #ccc;
  line-height: 40px;
  font-family: 72;
  font-weight: bold;
  text-align: left;
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
`;
