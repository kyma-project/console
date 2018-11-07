import React from 'react';

import { Select } from '@kyma-project/react-components';

import { compareTwoObjects } from '../../../../commons/helpers';
import { Link, SubSectionTitle } from './styled';

import { bindingVariables } from '../InfoButton/variables';
import InfoButton from '../InfoButton/InfoButton.component';

class BindingsStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkbox: props.data.checkbox,
      selectedExistingBinding: props.data.selectedExistingBinding,
      bindingsStepFilled: props.data.bindingsStepFilled,
    };
  }

  componentDidMount() {
    const { checkbox, selectedExistingBinding } = this.state;

    const bindingsStepFilled =
      (!checkbox && selectedExistingBinding !== '') ||
      (checkbox && selectedExistingBinding === '');

    this.setState({
      bindingsStepFilled: bindingsStepFilled,
    });

    const tooltipData = {
      type: 'error',
      content: 'Fill out all mandatory fields',
    };

    this.props.callback({
      bindingsStepFilled: bindingsStepFilled,
      checkbox: checkbox,
      selectedExistingBinding: selectedExistingBinding,
      tooltipData: !bindingsStepFilled ? tooltipData : null,
    });
  }

  componentDidUpdate(_, nextState) {
    const { checkbox, selectedExistingBinding } = this.state;

    if (!compareTwoObjects(this.state, nextState)) {
      const bindingsStepFilled =
        (!checkbox && selectedExistingBinding !== '') ||
        (checkbox && selectedExistingBinding === '');

      this.setState({ bindingsStepFilled: bindingsStepFilled });

      const tooltipData = !bindingsStepFilled
        ? {
            type: 'error',
            content: 'Fill out all mandatory fields',
          }
        : null;

      this.props.callback({
        bindingsStepFilled: bindingsStepFilled,
        checkbox: checkbox,
        selectedExistingBinding: selectedExistingBinding,
        tooltipData: tooltipData,
      });
    }
  }

  handleCheckbox = value => {
    this.setState({ checkbox: value, selectedExistingBinding: '' });
  };

  handleSelect = value => {
    this.setState({ selectedExistingBinding: value });
  };

  content = () => {
    const { existingServiceBindings } = this.props;
    const { checkbox, selectedExistingBinding } = this.state;

    if (checkbox) {
      return null;
    }

    const items = existingServiceBindings.map((binding, index) => (
      <option key={index} value={binding.name}>
        {binding.name}
      </option>
    ));

    return (
      <Select
        label={'Select Existing Service Binding'}
        handleChange={this.handleSelect}
        name={'selectedExistingBinding'}
        current={selectedExistingBinding}
        items={items}
        firstEmptyValue
        required={true}
        noBottomMargin
      />
    );
  };

  render() {
    const { checkbox } = this.state;
    const { showInfo, existingServiceBindings } = this.props;
    const serviceBindingsExist =
      (existingServiceBindings && existingServiceBindings.length > 0) || false;

    return (
      <div>
        <SubSectionTitle margin={checkbox ? '20px 0 10px' : '20px 0'}>
          {checkbox &&
            serviceBindingsExist && (
              <Link onClick={() => this.handleCheckbox(false)}>
                {'Select existing credentials'}
                {showInfo && (
                  <InfoButton content={bindingVariables.serviceBinding} />
                )}
              </Link>
            )}
          {!checkbox && (
            <Link onClick={() => this.handleCheckbox(true)}>
              {'Create new credentials'}
              {showInfo && (
                <InfoButton content={bindingVariables.serviceBinding} />
              )}
            </Link>
          )}
        </SubSectionTitle>
        {this.content()}
      </div>
    );
  }
}

export default BindingsStep;
