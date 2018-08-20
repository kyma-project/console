import styled from 'styled-components';

export const TooltipContainer = styled.div`
  position: absolute;
  box-sizing: border-box;
  z-index: 199;
  min-width: ${props => (props.minWidth ? props.minWidth : '150px')};
  max-width: ${props => (props.maxWidth ? props.maxWidth : '420px')};
  background: #fff;
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
  bottom: 100%;
  right: 50%;
  transform: translateX(40px);
  visibility: ${props => (props.show ? 'visibility' : 'hidden')};
  opacity: ${props => (props.show ? '1' : '0')};
  margin-bottom: 16px;

  &:after {
    border: 10px solid;
    border-color: white transparent transparent;
    content: '';
    right: 25px;
    margin-left: -10px;
    position: absolute;
    top: 100%;
    margin-top: -1px;
  }
`;

export const TooltipWrapper = styled.div`
  font-family: '72';
  position: relative;
  display: inline-block;
  z-index: 198;

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
  text-align: left;
  color: #32363b;
  font-size: 13px;
  padding: 12px 14px;
`;

export const TooltipHeader = styled.div`
  border-bottom: 1px solid rgba(204, 204, 204, 0.3);
  line-height: 13px;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  color: #32363a;
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
    line-height: 13px;
    font-size: 13px;
    box-sizing: border-box;
    font-family: SAP-Icons;
  }
`;

export const TooltipFooter = styled.div`
  border-bottom: 1px solid #ccc;
  line-height: 40px;
  font-family: 72;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  color: #32363a;
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
`;
