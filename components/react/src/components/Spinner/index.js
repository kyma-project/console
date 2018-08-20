import styled from 'styled-components';

const Spinner = styled.div`
  position: relative;
  height: ${props => (props.size ? props.size : '1em')};
  width: ${props => (props.size ? props.size : '1em')};
  overflow: show;
  margin: auto;
  padding: ${props => (props.padding ? props.padding : '0')};
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  font-size: ${props => (props.size ? props.size : '1em')};

  &:after {
    content: '\uE00A';
    position: absolute;
    display: block;
    font-family: SAP-Icons;
    font-weight: ${props => (props.fontWeight ? props.fontWeight : '500')};
    color: ${props => (props.color ? props.color : 'rgb(0, 182, 255)')};
    animation: spin ${props => (props.speed ? props.speed : '4s')} infinite
      linear;
  }

  @keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
`;

export default Spinner;
