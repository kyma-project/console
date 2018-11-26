import React from 'react';
import styled from 'styled-components';
import Form from 'react-jsonschema-form';

const StyledForm = styled(Form)`
  .form-group .form-group {
    margin: 0 0 16px 0;

    &:last-child {
      margin: 0;
    }
  }

  label {
    width: 100%;
    font-family: '72';
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.14;
    letter-spacing: normal;
    text-align: left;
    color: #32363b;
    display: block;
  }

  input {
    padding: 0 10px;
    display: block;
    box-sizing: border-box;
    margin-top: 6px;
    outline: none;

    &[type='text'],
    &[type='password'] {
      font-size: 14px;
      border-radius: 4px;
      background-color: #ffffff;
      padding: ${props => (props.isError ? '0 0 0 10px' : '1px 1px 1px 11px')};
      border: solid
        ${props =>
          props.isError ? '2px #ee0000' : '1px rgba(50, 54, 58, 0.15)'};
      transition: border-color ease-out 0.2s;
      width: 100%;
      height: 36px;
      margin-top: 6px;
    }

    &[type='text']::placeholder,
    &[type='password']::placeholder {
      font-style: italic;
      color: #32363b;
      opacity: 0.5;
    }

    &[type='text']:hover,
    &[type='password']:hover {
      border: 1px solid #2196f3;
    }

    &[type='text']:focus,
    &[type='password']:focus {
      border: 1px solid #2196f3;
    }

    &[type='checkbox'] {
      margin-left: 0;
      margin-right: 10px;
    }
  }

  select {
    padding: 0 32px 0 10px;
    margin-top: 10px;
    margin-top: 10px;
    font-size: 14px;
    width: 100%;
    height: 36px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.4);
    border: solid 1px rgba(50, 54, 58, 0.15);
    outline: none;
    display: block;
    transition: border-color ease-out 0.2s;
    position: relative;

    &:hover {
      border: 1px solid #2196f3;
    }

    &:focus {
      border: 1px solid #2196f3;
    }
  }

  select[multiple] {
    height: auto;

    option {
      padding: 7px 10px;
    }
  }

  .checkbox {
    label {
      display: block;
    }

    input {
      display: inline-block;
      margin: 0 6px 0 0;
    }
  }

  p.field-description {
    font-family: 72;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #32363b99;
    display: block;
    margin: 6px 0 0 0;
  }

  .required {
    padding-left: 3px;
    color: #ee0000;
  }

  .btn-add,
  .array-item-remove,
  .array-item-move-down,
  .array-item-move-up {
    appearance: none;
    border: 0;
    box-shadow: 0;
    padding: 0;
    line-height: 1.5;
    cursor: pointer;
    outline: none;
    display: block;
    font-family: 72;
    font-size: 14px;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.21;
    letter-spacing: normal;
    text-align: center;
    font-weight: normal !important;
  }

  .btn-add,
  .array-item-move-down,
  .array-item-move-up {
    color: #0a6ed1;
  }

  .btn-add {
    margin-top: 10px;

    i:before {
      content: '+ Add';
    }
  }

  .array-item-move-up i:before {
    content: 'Move up';
  }

  .array-item-move-down i:before {
    content: 'Move down';
  }

  .array-item-remove {
    color: #ee0000;
    i:before {
      content: 'Delete';
    }
  }

  .btn-group {
    display: block;
  }

  .array-item {
    padding: 16px 0;
    border-top: 1px solid rgba(204, 204, 204, 0.3);

    &:first-child {
      margin-top: 16px;
    }
    &:last-child {
      border-bottom: 1px solid rgba(204, 204, 204, 0.3);
    }
  }

  button[type='submit'] {
    display: none;
  }

  .config-error {
    width: 100%;
    font-family: '72';
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    padding: 10px 0;
    font-stretch: normal;
    line-height: 1.14;
    letter-spacing: normal;
    text-align: left;
    display: block;
    box-sizing: border-box;
  }

  pre {
    unicode-bidi: embed;
    font-family: 'Consolas', monospace;
    white-space: pre;
  }

  i {
    display: inline-block;
    margin-top: 16px;
  }

  .field-object .field-object {
    p.field-description {
      margin-bottom: 12px;
    }
    div.form-group {
      border-left: 2px solid rgba(204, 204, 204, 0.3);
      margin-bottom: 0;
      padding: 0 0 16px 16px;
    }
    div.form-group:last-child {
      padding: 0 0 0 16px;
    }
    div.row div.form-group {
      border-left: none;
      padding: 0;
    }
  }
`;

const JsonSchemaForm = props => {
  return <StyledForm {...props} />;
};

export default JsonSchemaForm;
