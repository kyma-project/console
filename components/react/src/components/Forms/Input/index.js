import React from 'react';
import PropTypes from 'prop-types';

import {
  FieldWrapper,
  FieldLabel,
  FieldIcon,
  FieldMessage,
  FieldRequired,
} from '../field-components';

import { InputWrapper, InputField, InputPasswordField } from './components';

class Input extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    handleChange: PropTypes.func,
    validFunctions: PropTypes.arrayOf(PropTypes.func),
    name: PropTypes.string,
    required: PropTypes.bool,
    message: PropTypes.string,
    onBlur: PropTypes.any,
    isSuccess: PropTypes.bool,
    isWarning: PropTypes.bool,
    isError: PropTypes.bool,
    type: PropTypes.string,
    noBottomMargin: PropTypes.bool,
    noMessageField: PropTypes.bool,
  };

  static defaultProps = {
    placeholder: '',
    required: false,
    value: '',
    message: '',
    isSuccess: false,
    isWarning: false,
    isError: false,
    type: 'text',
    noBottomMargin: false,
    noMessageField: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      showPassword: false,
      typeField: props.type,
      validationType: '',
      validationMessage: '',
    };
  }

  componentDidMount() {
    this.validate(this.props.value);
  }

  handleClickEyeIcon = () => {
    this.setState({
      showPassword: !this.state.showPassword,
      typeField: this.state.typeField === 'text' ? 'password' : 'text',
    });
  };

  validate = value => {
    const { validFunctions } = this.props;
    if (!validFunctions || validFunctions.length == 0) {
      return;
    }

    let results = [],
      numberOfSucesses = 0;
    validFunctions.map(func => results.push(func(value)));

    for (const result of results) {
      if (result !== undefined) {
        if (
          result.validationType === 'error' ||
          result.validationType === 'warning'
        ) {
          this.setState({
            validationType: result.validationType,
            validationMessage: result.validationMessage
              ? result.validationMessage
              : '',
          });
          return;
        } else {
          numberOfSucesses++;
        }
      }
      this.setState({
        validationType: numberOfSucesses === results.length ? 'success' : '',
      });
    }
    this.setState({
      validationType: 'success',
      validationMessage: '',
    });
  };

  extractIcon(isSuccess, isWarning, isError) {
    if (isError) return '\uE0B1';
    if (isWarning) return '\uE094';
    if (isSuccess) return '\uE05B';
    return '';
  }

  render() {
    const {
      label,
      placeholder,
      handleChange,
      validFunctions,
      name,
      required,
      message = '',
      onBlur,
      isSuccess,
      isWarning,
      isError,
      type,
      noBottomMargin,
      noMessageField,
    } = this.props;

    const {
      value,
      showPassword,
      typeField,
      validationType,
      validationMessage,
    } = this.state;

    const finalMessage = validationMessage ? validationMessage : message;
    const success = validationType === 'success' ? true : isSuccess;
    const warning = validationType === 'warning' ? true : isWarning;
    const error = validationType === 'error' ? true : isError;

    const isPassword = type === 'password';

    return (
      <FieldWrapper noBottomMargin={noBottomMargin}>
        <FieldLabel>
          {label}
          {required ? <FieldRequired>*</FieldRequired> : ''}
        </FieldLabel>
        <InputWrapper>
          <InputField
            type={typeField ? typeField : 'text'}
            placeholder={placeholder}
            value={value}
            name={name}
            onChange={e => {
              const value = e.target.value;
              this.setState({ value: value });
              this.validate(value);
              handleChange(value);
            }}
            isSuccess={success}
            isWarning={warning}
            isError={error}
            required={required}
          />
          <FieldIcon
            visible={success || warning || error}
            isSuccess={success}
            isWarning={warning}
            isError={error}
            isPassword={isPassword}
          >
            {this.extractIcon(success, warning, error)}
          </FieldIcon>
          {isPassword && (
            <InputPasswordField onClick={this.handleClickEyeIcon}>
              {showPassword ? '\uE1EA' : '\uE1E9'}
            </InputPasswordField>
          )}
        </InputWrapper>
        {noMessageField ? null : (
          <FieldMessage
            visible={finalMessage}
            isSuccess={success}
            isWarning={warning}
            isError={error}
          >
            {finalMessage}
          </FieldMessage>
        )}
      </FieldWrapper>
    );
  }
}

export default Input;
