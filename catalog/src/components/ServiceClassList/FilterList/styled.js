import styled from 'styled-components';

export const FilterContainer = styled.div`
  box-sizing: border-box;
  width: 300px;
  margin: 14px 30px;
  text-align: left;
`;

export const FilterHeader = styled.div`
  font-family: '72';
  font-size: 12px;
  font-weight: 300;
  text-align: left;
  color: rgba(63, 80, 96, 0.6);
  padding: 10px 0;
  text-transform: uppercase;
`;

export const Items = styled.ul`
  margin: 0;
  padding: 0;
`;

export const Item = styled.li`
  display: block;
  padding: 10px 0;
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
