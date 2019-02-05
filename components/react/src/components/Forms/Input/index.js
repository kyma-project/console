import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  FormSet,
  FormItem,
  FormLabel,
  FormInput,
  FormMessage,
} from 'fundamental-react';

const FormSetWrapper = styled.div`
  padding-top: ${props => props.marginTop || '0'}px;
`;

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
    marginTop: PropTypes.number,
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
        validationType: numberOfSucesses === results.length ? 'valid' : '',
      });
    }
    this.setState({
      validationType: 'valid',
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
      name,
      required,
      message = '',
      isSuccess,
      isWarning,
      isError,
      noMessageField,
      marginTop,
    } = this.props;

    const { value, typeField, validationType, validationMessage } = this.state;

    const finalMessage = validationMessage ? validationMessage : message;
    const valid = validationType === 'valid' || isSuccess ? 'valid' : '';
    const warning = validationType === 'warning' || isWarning ? 'warning' : '';
    const error = validationType === 'error' || isError ? 'error' : '';

    const randomId = `input-${(Math.random() + 1).toString(36).substring(7)}`;
    return (
      <FormSetWrapper marginTop={marginTop}>
        <FormSet>
          <FormItem>
            {label && (
              <FormLabel htmlFor={randomId} required={required}>
                {label}
              </FormLabel>
            )}
            <FormInput
              id={randomId}
              type={typeField ? typeField : 'text'}
              placeholder={placeholder}
              name={name}
              value={value}
              state={error ? 'invalid' : '' || warning || valid}
              onChange={e => {
                const value = e.target.value;
                this.setState({ value: value });
                this.validate(value);
                handleChange(value);
              }}
            />
            {!noMessageField &&
              finalMessage && (
                <FormMessage type={error || warning || valid}>
                  {finalMessage}
                </FormMessage>
              )}
          </FormItem>
        </FormSet>
      </FormSetWrapper>
    );
  }
}

export default Input;
