import styled from 'styled-components';

const getColorFromType = props => {
  switch (props.type) {
    case 'note':
      return '#0073e6';
    case 'tip':
      return '#49C7A0';
    case 'caution':
      return '#DD0000';
    default:
      return 'unset';
  }
};

export const NotePanelWrapper = styled.blockquote`
  margin-left: 0;
  margin-right: 0;
  padding: 16px;
  border-left: 3px solid ${props => getColorFromType(props)};
`;

export const NotePanelContent = styled.div`
  display: inline-block;
  > p {
    margin-bottom: 5px;
  }
  &&&& ul {
    margin-bottom: 0;
  }
  & li {
    margin-bottom: 3px;
  }
`;
