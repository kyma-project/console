import styled from 'styled-components';

export const CreateCredentialsButton = styled.button`
  padding: 0;
  background: none;
  border: 0;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: right;
  margin-right: 0;
  color: #0a6ed1;
  opacity: ${props => (props.disabled ? '0.5' : '1')};
  text-decoration: none;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`;
