import styled from 'styled-components';
import { Button, sizes } from '@kyma-project/react-components';

export const FiltersDropdown = styled.div`
  .fd-button--emphasized {
    padding-left: 30px;
    padding-right: 30px;

    @media (min-width: ${sizes.tablet}px) {
      margin-left: 87px;
    }
  }

  .fd-popover__body--right {
    &:after {
      right: 22px;
    }
  }

  .fd-popover__body--right {
    margin-top: 5px;
    right: 0px;

    &:before {
      right: 22px;
    }
  }
`;

export const Checkmark = styled.div`
  flex: 0 0 auto;
  position: relative;
  width: 16px;
  height: 16px;
  margin-right: 10px;
  border-radius: 4px;
  border: ${props =>
    props.checked ? 'solid 1px #0a6ed1' : 'solid 1px rgba(56, 70, 84, 0.5)'};
  box-sizing: border-box;
  background-color: ${props => (props.checked ? '#0a6ed1' : 'transparent')};

  &:after {
    content: '\uE05B';
    color: #fff;
    opacity: ${props => (props.checked ? '1.0' : '0')};
    transition: opacity ease-out 0.2s;
    position: absolute;
    font-family: SAP-icons;
    font-size: 11px;
    font-style: normal;
    font-weight: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
  }
`;

export const FiltersContainer = styled.div`
  box-sizing: border-box;
  margin: 10px 10px;
  text-align: left;
`;

export const FilterHeader = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  color: rgba(63, 80, 96, 0.6);
  padding: 10px 0;
  text-transform: uppercase;
`;

export const FilterContainer = styled.div`
  margin: 10px 5px;
`;

export const Items = styled.ul`
  margin: 0;
  padding: 0;
  max-height: 235px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

export const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
`;

export const Link = styled.a`
  color: ${props => (props.active ? '#167ee6' : '#32363a')};
  font-family: '72';
  font-size: 14px;
  font-weight: normal;
  font-weight: normal;

  &:hover {
    color: #167ee6;
    cursor: pointer;
  }
`;

export const SearchWrapper = styled.div`
  width: 200px;
  padding: 15px;
`;

export const ClearAllActiveFiltersButton = styled(Button)`
  && {
    margin-top: 6px;
  }
`;
