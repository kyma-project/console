import styled from 'styled-components';
import { media } from '@kyma-project/components';
import { Icon } from 'fundamental-react';

export const NavigationWrapper = styled.div`
  background: #fff;
  height: 100vh;
  box-shadow: rgba(50, 54, 58, 0.08) 0px 5px 20px 0px;

  ${media.phone`
    display: none;
  `};
`;

export const ContentWrapper = styled.div`
  margin-top: 16px;
`;

export const GoBack = styled.div`
  margin: 0;
  color: #51555a;
  display: block;
  font-weight: 400;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 20px;
  text-transform: inherit;
  transition: all 125ms ease-in;

  [class^='sap-icon--'] {
    display: inline-block;
    position: relative;
    top: 2px;
    margin-right: 10px;
  }

  &:hover {
    cursor: pointer;
    background-color: #fafafa;
    color: #085caf;
  }
`;

export const Wrapper = styled.div``;

export const NavigationContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0;
  text-align: left;
`;

export const NavigationArrow = styled.div`
  flex: 1;
  text-align: right;
`;

export const NavigationHeader = styled.section`
  position: relative;
  border-top: 1px solid #eeeeef;
  background: #fafafa;
  font-weight: 500;
  text-align: left;
  color: rgba(63, 80, 96, 0.8);
  padding: 10px 20px 10px 16px;
  font-size: 14px;
  line-height: 20px;
  text-transform: inherit;
  display: flex;
  justify-content: flex-start;

  [class^='sap-icon--'] {
    display: inline-block;
    position: relative;
    top: 2px;
    margin-right: 6px;
  }
`;

interface NavigationItemsProps {
  marginTop?: boolean;
  secondary?: boolean;
  showAll?: boolean;
  show?: boolean;
}

export const NavigationItems = styled.ul<NavigationItemsProps>`
  && {
    margin: 0;
    margin-top: ${props => (props.marginTop ? '10px' : '0')};
    margin-bottom: ${props => (props.marginTop ? '-10px' : '0')};
    margin-left: ${props => (props.secondary ? '10px' : '0')};
    padding: ${props => (props.showAll ? '0 34px 20px 34px' : '0')};
    max-height: ${props =>
      (props.show && '9000px') || (props.showAll && 'auto') || '0'};
    overflow: ${props => (props.show ? 'auto' : 'hidden')};
  }
`;

export const NavigationItem = styled.li`
  display: block;
  padding: 10px 0;
`;

export const NavigationLinkWrapper = styled.div`
  position: relative;
`;

interface NavigationSectionArrow {
  active?: boolean;
  activeArrow?: boolean;
}

export const NavigationSectionArrow = styled.a<NavigationSectionArrow>`
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
      props.active ? `3px solid #0b74de` : '3px solid rgba(50,54,58,0.6)'};
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

interface NavigationLinkProps {
  active?: boolean;
  noArrow?: boolean;
}

export const NavigationLink = styled.a<NavigationLinkProps>`
  color: ${props => (props.active ? `#0b74de` : '#32363a')};
  font-size: 14px;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  display: block;
  border: 1px solid transparent;
  border-left: ${props =>
    props.active && props.noArrow ? '3px solid' : '1px solid transparent'};
  position: relative;

  :hover {
    color: #0b74de;
    cursor: pointer;
  }
`;

Icon.defaultProps = { glyph: 'feeder-arrow', size: 's' };
export const CollapseArrow = styled(Icon)`
  && {
    margin-left: 5px;
    position: relative;
    top: 1px;
    display: inline-block;
    cursor: pointer;
  }
  &:before {
    transition: 0.3s ease;
    ${props => props.open && 'transform: rotate(90deg);'};
  }
`;
