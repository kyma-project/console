import styled from "styled-components";
import { ACTIVE_COLOR } from '../../../../commons/variables';

export const Wrapper = styled.div`
`;

export const NavigationContainer = styled.div`
  box-sizing: border-box;
  width: 300px;
  padding: 7px 30px;
  text-align: left;
`;

export const NavigationHeader = styled.div`
  font-family: '72';
  font-size: 12px;
  font-weight: 300;
  text-align: left;
  color: rgba(63, 80, 96, 0.6);
  padding: 10px 0;
  text-transform: uppercase;
`;

export const NavigationItems = styled.ul`
  margin: 0;
  margin-top: ${props => (props.marginTop ? '10px' : '0')};
  margin-bottom: ${props => (props.marginTop ? '-10px' : '0')};
  margin-left: ${props => (props.secondary ? '10px' : '0')};
  padding: 0;
  max-height: ${props =>
    (props.show && '9000px') || (props.showAll && 'auto') || '0'};
  overflow: ${props => (props.show ? 'auto' : 'hidden')};
`;

export const NavigationItem = styled.li`
  display: block;
  padding: 10px 0;
`;

export const NavigationLinkWrapper = styled.div`
  position: relative;
`;
export const NavigationSectionArrow = styled.a`
  width: 16px;
  height: 100%;
  display: block;
  position: absolute;
  z-index: 50;
  cursor: pointer;

  :before {
    content: '';
    display: 'block';
    width: 0;
    height: 0;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-left: ${props =>
      props.active
        ? `3px solid ${ACTIVE_COLOR}`
        : '3px solid rgba(50,54,58,0.6)'};
    left: 2px;
    top: 50%;
    position: absolute;
    transform: translateY(-50%);
    transform: ${props =>
      props.activeArrow
        ? 'translateY(-50%) rotate(90deg)'
        : 'translateY(-50%)'};
  }
`;
export const NavigationLink = styled.a`
  color: ${props => (props.active ? ACTIVE_COLOR : '#32363a')};
  font-family: '72';
  font-size: 14px;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  display: block;
  border: 1px solid transparent;
  border-left: ${props =>
    props.active && props.noArrow ? '3px solid' : '1px solid transparent'};
  padding-left: 6px;
  margin-left: 10px;
  position: relative;

  :hover {
    color: ${ACTIVE_COLOR};
    cursor: pointer;
  }
`;
