import styled from 'styled-components';

export const TabsContent = styled.div`
  margin: ${props => (props.margin ? props.margin : '20px')};
  font-size: 14px;
  color: #515559;
  line-height: 1.57;
`;

export const TabsHeader = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 5px;
  display: flex;
  justify-items: flex-start;
  flex-flow: row nowrap;
`;

export const TabsHeaderAdditionalContent = styled.li`
  margin: 0 15px 0 auto;
  padding: 17px 0 15px;
  border: none;
  position: relative;
  color: ${props => (props.active ? '#0a6ed1' : '#32363b')};
  font-size: 14px;
  outline: none;
  display: inline-block;
  transition: 0.2s color linear;
  cursor: pointer;

  &:first-letter {
    text-transform: uppercase;
  }

  &:hover {
    color: #0a6ed1;
    cursor: pointer;
  }
`;

export const TabsWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: '72';
  font-weight: normal;
`;
