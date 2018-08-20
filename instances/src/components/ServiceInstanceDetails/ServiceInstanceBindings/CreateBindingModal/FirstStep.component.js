import React from 'react';

import { Input, Select, Checkbox } from '@kyma-project/react-components';

import { compareTwoObjects } from '../../../../commons/helpers';

class FirstStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkbox: props.data.checkbox,
      nameServiceBinding: props.data.nameServiceBinding,
      selectedExistingBinding: props.data.selectedExistingBinding,
      firstStepFilled: props.data.firstStepFilled,
    };
  }

  componentDidMount() {
    const {
      checkbox,
      nameServiceBinding,
      selectedExistingBinding,
    } = this.state;

    const firstStepFilled =
      (checkbox && nameServiceBinding !== '') ||
      (!checkbox && selectedExistingBinding !== '');

    this.setState({
      firstStepFilled: firstStepFilled,
    });

    const tooltipData = {
      type: 'error',
      content: 'Fill out all mandatory fields',
    };

    this.props.callback({
      firstStepFilled: firstStepFilled,
      checkbox: checkbox,
      nameServiceBinding: nameServiceBinding,
      selectedExistingBinding: selectedExistingBinding,
      tooltipData: !firstStepFilled ? tooltipData : null,
    });
  }

  componentDidUpdate(nextProps, nextState) {
    const {
      checkbox,
      nameServiceBinding,
      selectedExistingBinding,
    } = this.state;

    if (!compareTwoObjects(this.state, nextState)) {
      const firstStepFilled =
        (checkbox && nameServiceBinding !== '') ||
        (!checkbox && selectedExistingBinding !== '');

      this.setState({ firstStepFilled: firstStepFilled });

      const tooltipData = !firstStepFilled
        ? {
            type: 'error',
            content: 'Fill out all mandatory fields',
          }
        : null;

      this.props.callback({
        firstStepFilled: firstStepFilled,
        checkbox: checkbox,
        nameServiceBinding: nameServiceBinding,
        selectedExistingBinding: selectedExistingBinding,
        tooltipData: tooltipData,
      });
    }
  }

  handleCheckbox = () => {
    this.setState({ checkbox: !this.state.checkbox });
  };

  handleInput = value => {
    this.setState({ nameServiceBinding: value });
  };

  handleSelect = value => {
    this.setState({ selectedExistingBinding: value });
  };

  content = () => {
    const { existingServiceBindings } = this.props;
    const {
      checkbox,
      nameServiceBinding,
      selectedExistingBinding,
    } = this.state;

    if (checkbox) {
      return (
        <Input
          label={'Name'}
          placeholder={'Specify a name for your new Service Binding'}
          value={nameServiceBinding}
          handleChange={this.handleInput}
          name={'nameServiceBinding'}
          required={true}
          noBottomMargin
          noMessageField
        />
      );
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

    return (
      <div>
        <Checkbox
          label={'Create new Service Binding'}
          handleChange={this.handleCheckbox}
          checked={checkbox}
        />
        {this.content()}
      </div>
    );
  }
}

export default FirstStep;
