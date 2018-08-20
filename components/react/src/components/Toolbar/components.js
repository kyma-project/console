import styled from 'styled-components';

export const ToolbarWrapper = styled.div`
  box-sizing: border-box;
  font-family: '72';
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  position: relative;
  padding: ${props =>
    props.customPadding ||
    (props.smallText && props.addSeparator && '15px 30px') ||
    (props.smallText && '17px 34px 5px') ||
    (props.addSeparator && '20px 30px') ||
    '20px 34px 5px'};
  &::after {
    content: ${props => (props.addSeparator ? '""' : '')};
    height: 1px;
    opacity: 0.1;
    background-color: #000000;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

export const ToolbarBackButton = styled.button`
  font-size: 12px;
  position: relative;
  line-height: 21px;
  min-height: 25px;
  color: #167ee6;
  background-color: transparent;
  border: none;
  outline: none;
  padding-left: 30px;
  text-align: left;
  flex: ${props => (props.largeBackButton ? '0 1 100%' : '0 1 auto')};
  padding-left: ${props =>
    (props.largeBackButton && '24px') || (props.smallText && '22px') || '30px'};
  margin-bottom: ${props => (props.largeBackButton ? '15px' : '0')};
  border-right: ${props =>
    props.largeBackButton ? 'none' : '1px solid #d8d8d8;'};
  margin-right: ${props =>
    (props.largeBackButton && '0') || (props.smallText && '15px') || '20px'};

  &::before {
    content: '←';
    font-family: LucidaGrande;
    font-size: ${props => (props.smallText ? '18px' : '19px')};
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    position: absolute;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const ToolbarHeadline = styled.h2`
  font-size: ${props => (props.smallText ? '18px' : '23px')};
  padding: 4px 0;
  margin: 0;
  color: #32363a;
  font-weight: normal;
`;

export const ToolbarDescription = styled.div`
  padding: 4px 0;
  font-size: 16px;
  font-weight: 300;
  color: rgba(50, 54, 58, 0.6);
`;

export const ToolbarRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-self: flex-start;
  margin-left: auto;
  flex: 1 1 auto;
`;
