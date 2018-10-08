import styled from 'styled-components';

export const InputWrapper = styled.div`
  display: block;
  box-sizing: border-box;
  position: relative;
`;

export const InputField = styled.input`
  padding: 0 10px;
  display: ${props =>
    (props.type && props.type === 'checkbox') || props.type === 'radio'
      ? 'inline-block'
      : 'block'};
  box-sizing: border-box;
  transition: 0.3s border linear;
  outline: none;

  &[type='text'],
  &[type='password'] {
    font-size: 14px;
    border-radius: 4px;
    background-color: #ffffff;
    padding: ${props => (props.isError && '0 30px 0 10px') || '0 10px'};
    border: solid
      ${props =>
        (props.isError && '2px #ee0000') ||
        (props.isWarning && '2px #ffeb3b') ||
        (props.isSuccess && '2px #4caf50') ||
        '1px rgba(50, 54, 58, 0.15)'};
    width: 100%;
    transition: border-color ease-out 0.2s;
    height: 36px;
    margin: ${props => (props.margin ? props.margin : '0')};
  }

  &[type='text']::placeholder,
  &[type='password']::placeholder {
    font-style: italic;
    color: #32363b;
    opacity: 0.5;
  }

  &[type='text']:hover,
  &[type='password']:hover {
    border: solid
      ${props =>
        (props.isError && '2px #ee0000') ||
        (props.isWarning && '2px #ffeb3b') ||
        (props.isSuccess && '2px #4caf50') ||
        '1px #2196f3'};
  }

  &[type='text']:focus,
  &[type='password']:focus {
    color: '#2196f3';
    border: solid
      ${props =>
        (props.isError && '2px #ee0000') ||
        (props.isWarning && '2px #ffeb3b') ||
        (props.isSuccess && '2px #4caf50') ||
        '1px #2196f3'};
  }

  &[type='checkbox'] {
    margin-left: 0;
    margin-right: 10px;
  }
`;

export const InputPasswordField = styled.span`
  display: block;
  font-family: SAP-Icons;
  color: '#32363b';
  position: absolute;
  right: 16px;
  top: 8px;
  cursor: pointer;
`;
