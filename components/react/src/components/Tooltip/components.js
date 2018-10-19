import styled from 'styled-components';

export const TooltipContainer = styled.div`
  position: absolute;
  box-sizing: border-box;
  z-index: 99;
  min-width: ${props => (props.minWidth ? props.minWidth : '120px')};
  max-width: ${props => (props.maxWidth ? props.maxWidth : '420px')};
  background: ${props =>
    props.type === 'default' && !props.light ? '#32363a' : '#fff'};
  font-size: ${props => (props.type === 'default' ? '11px' : '12px')};
  line-height: ${props => (props.type === 'default' ? '11px' : '12px')};
  color: ${props =>
    props.type === 'default' && !props.light ? '#fff' : '#32363b'};
  filter: drop-shadow(rgba(0, 0, 0, 0.12) 0 0px 2px);
  box-shadow: 0 0 4px 0 #00000026, 0 12px 20px 0 #00000019;
  border-radius: 3px;
  border-left: ${props => {
    let color = '';
    switch (props.type) {
      case 'info':
        color = '#0b74de';
        break;
      case 'warning':
        color = '#ffeb3b';
        break;
      case 'success':
        color = '#4caf50';
        break;
      case 'error':
        color = '#f44336';
        break;
      default:
        color = 'none';
    }
    return `6px solid ${color}`;
  }};
  ${props => (props.orientation === 'top' ? 'bottom: 100%;' : 'top: 100%')};
  right: 50%;

  ${props => (props.type === 'light' && 'left: 0;') || 'right: 50%'};
  transform: translateX(
    ${props =>
      (props.type === 'default' && '50%') ||
      (props.type === 'light' && '-40px') ||
      '40px'}
  );
  visibility: ${props => (props.show ? 'visibility' : 'hidden')};
  opacity: ${props => (props.show ? '1' : '0')};
  ${props => {
    switch (props.orientation) {
      case 'bottom':
        return `margin-top: ${props.type === 'default' ? '8px' : '16px'}`;
      default:
        return `margin-bottom: ${props.type === 'default' ? '8px' : '16px'}`;
    }
  }};

  &:after {
    border: ${props => (props.type === 'default' ? '6px' : '10px')} solid;
    border-color: ${props => {
      switch (props.orientation) {
        case 'bottom':
          return `transparent transparent ${
            props.type === 'default' ? '#32363b' : '#fff'
          }`;
        default:
          return `${
            props.type === 'default' ? '#32363b' : '#fff'
          } transparent transparent`;
      }
    }};
    content: '';
    ${props =>
      (props.type === 'default' && 'right: 50%;') ||
      (props.type === 'light' && 'left: 48px;') ||
      'right: 25px'};
    ${props => (props.type === 'default' ? 'transform: translateX(6px)' : '')};
    margin-left: -10px;
    position: absolute;
    ${props => (props.orientation === 'top' ? 'top: 100%;' : 'bottom: 100%')};
    margin-top: -1px;
  }
`;

export const TooltipWrapper = styled.div`
  font-family: '72';
  position: relative;
  display: inline-block;

  &:hover ${TooltipContainer} {
    visibility: visible;
    opacity: 1;
  }
`;

export const TooltipContent = styled.div`
  display: block;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: ${props => (props.type === 'default' ? 'center' : 'left')};
  padding: ${props => (props.type === 'default' ? '6px 10px' : '12px 14px')};
`;

export const TooltipHeader = styled.div`
  border-bottom: 1px solid rgba(204, 204, 204, 0.3);
  font-weight: bold;
  text-align: left;
  position: relative;
  padding: 12px 14px;
  box-sizing: border-box;

  &:after {
    ${props => {
      switch (props.type) {
        case 'info':
          return "content: '\uE1C3'; color: #0b74de;";
        case 'warning':
          return "content: '\uE053'; color: #ffeb3b;";
        case 'success':
          return "content: '\uE1C1'; color: #4caf50;";
        case 'error':
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
