import styled from 'styled-components';

export const TableCell = styled.div`
  font-size: 14px;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: left;
  padding: 15px 20px;
  color: #32363b;
  color: ${props => props.color};
  cursor: ${props => (props.pointer ? 'pointer' : 'auto')};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 'normal')};

  > a {
    text-decoration: none;
    color: ${props => props.color} !important;
  }
`;
