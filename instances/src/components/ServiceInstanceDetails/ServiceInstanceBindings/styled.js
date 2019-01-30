import styled from 'styled-components';

export const ServiceInstanceBindingsWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0 0 20px 0;
  text-align: left;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.08);
  font-family: '72';
  font-weight: normal;
  border-left: ${props => (props.color ? '6px solid ' + props.color : 'none')};
`;

export const LinkButton = styled.span`
  font-weight: bold;
`;

export const SecretModalButton = styled.span`
  cursor: pointer;
  color: #0a6ed1;
  margin: ${props => props.margin};
`;

export const ActionsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Bold = styled.span`
  font-weight: bold;
`;
