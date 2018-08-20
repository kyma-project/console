import React from 'react';

import { Icon, Input, Select, Spinner } from '@kyma-project/react-components';

import { WarningText, IconWrapper } from './styled';

import { compareTwoObjects } from '../../../../commons/helpers';

class SecondStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameServiceBindingUsage: props.data.nameServiceBindingUsage,
      selectedKind: props.data.selectedKind,
      selectedResource: props.data.selectedResource,
      usageKindResources: props.data.usageKindResources,
      usageKindResourcesLoading: false,
      possibilityToCreate: false,
    };
  }

  componentDidMount() {
    const {
      nameServiceBindingUsage,
      selectedKind,
      selectedResource,
      usageKindResources,
    } = this.state;

    const possibilityToCreate =
      nameServiceBindingUsage !== '' &&
      selectedKind !== '' &&
      selectedResource !== '';

    this.setState({
      possibilityToCreate: possibilityToCreate,
    });

    const tooltipData = !possibilityToCreate
      ? {
          type: 'error',
          content: 'Fill out all mandatory fields',
        }
      : null;

    this.props.callback({
      possibilityToCreate: possibilityToCreate,
      nameServiceBindingUsage: nameServiceBindingUsage,
      selectedKind: selectedKind,
      selectedResource: selectedResource,
      usageKindResources: usageKindResources,
      tooltipData: !possibilityToCreate ? tooltipData : null,
    });
  }

  componentDidUpdate(nextProps, nextState) {
    const {
      nameServiceBindingUsage,
      selectedKind,
      selectedResource,
      usageKindResources,
    } = this.state;

    if (!compareTwoObjects(this.state, nextState)) {
      const possibilityToCreate =
        nameServiceBindingUsage !== '' &&
        selectedKind !== '' &&
        selectedResource !== '';

      this.setState({
        possibilityToCreate: possibilityToCreate,
      });

      const tooltipData = !possibilityToCreate
        ? {
            type: 'error',
            content: 'Fill out all mandatory fields',
          }
        : null;

      this.props.callback({
        possibilityToCreate: possibilityToCreate,
        nameServiceBindingUsage: nameServiceBindingUsage,
        selectedKind: selectedKind,
        selectedResource: selectedResource,
        usageKindResources: usageKindResources,
        tooltipData: tooltipData,
      });
    }
  }

  handleInput = value => {
    this.setState({ nameServiceBindingUsage: value });
  };

  handleKind = async value => {
    this.setState({
      selectedKind: value,
      selectedResource: '',
      usageKindResourcesLoading: Boolean(value),
      usageKindResources: null,
    });

    if (!value) return;

    const response = (await this.props.fetchUsageKindResources(value)).data
      .usageKindResources;

    this.setState({
      usageKindResources: response,
      usageKindResourcesLoading: false,
    });
  };

  handleResource = value => {
    this.setState({ selectedResource: value });
  };

  content = () => {
    const {
      selectedResource,
      usageKindResourcesLoading,
      usageKindResources,
    } = this.state;

    if (usageKindResourcesLoading) {
      return <Spinner padding="20px" size="30px" color="rgba(50,54,58,0.6)" />;
    }
    if (usageKindResources && usageKindResources.length > 0) {
      let mappedItems = [];
      mappedItems = usageKindResources.map((resource, index) => (
        <option key={index} value={resource.name}>
          {resource.name}
        </option>
      ));

      return (
        <Select
          label={'Resources'}
          handleChange={this.handleResource}
          name={'selectedResource'}
          current={selectedResource}
          firstEmptyValue
          items={mappedItems}
          required={true}
          noBottomMargin
        />
      );
    }
    if (usageKindResources && usageKindResources.length === 0) {
      return (
        <WarningText>
          <IconWrapper>
            <Icon icon={'\uE0B1'} />
          </IconWrapper>&nbsp; No Resources found
        </WarningText>
      );
    }
    return null;
  };

  render() {
    const { usageKinds } = this.props;
    const {
      nameServiceBindingUsage,
      selectedKind,
      usageKindResources,
    } = this.state;

    const mappedKinds = usageKinds.map((kind, index) => (
      <option key={index} value={kind.name}>
        {kind.displayName}
      </option>
    ));

    return (
      <div>
        <Input
          label={'Name'}
          placeholder={'Specify a name for your new Service Binding Usage'}
          value={
            nameServiceBindingUsage
              ? nameServiceBindingUsage
              : this.props.defaultBindingUsageName
          }
          handleChange={this.handleInput}
          name={'nameServiceBindingUsage'}
          required={true}
          noMessageField
        />
        <Select
          label={'Kind'}
          handleChange={this.handleKind}
          name={'selectedKind'}
          current={selectedKind}
          items={mappedKinds}
          firstEmptyValue
          required={true}
          noBottomMargin={usageKindResources === null}
        />
        {this.content()}
      </div>
    );
  }
}

export default SecondStep;
