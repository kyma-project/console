import styled from 'styled-components';

export const TabsContent = styled.div`
  margin: ${props => (props.noMargin ? "" : '20px')};
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
  margin: 0 0 0 auto;
  padding: 16px 15px 0 16px;
  border: none;
  position: relative;
  color: ${props => (props.active ? '#0a6ed1' : '#32363b')};
  font-size: 14px;
  outline: none;
  display: inline-block;
  transition: 0.2s color linear;

  &:first-letter {
    text-transform: uppercase;
  }

  &:hover {
    color: #0a6ed1;
  }
`;

export const TabsWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: '72';
  font-weight: normal;
  box-shadow: 0 5px 20px 0 rgba(50,54,58,.08);

  .fd-panel {
    box-shadow: none;
  }
`;
