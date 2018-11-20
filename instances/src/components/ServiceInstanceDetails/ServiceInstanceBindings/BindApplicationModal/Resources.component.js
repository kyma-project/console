import React from 'react';

import { Input, Select, Spinner } from '@kyma-project/react-components';

import { compareTwoObjects } from '../../../../commons/helpers';

import { bindingVariables } from '../InfoButton/variables';
import InfoButton from '../InfoButton/InfoButton.component';

import { Link, SubSectionTitle } from './styled';

class Resources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedResource: props.data.selectedResource,
      resourcesFilled: props.data.resourcesFilled,
      usageKindResources: props.data.usageKindResources,
      usageKindResourcesLoading: false,
      showPrefixInput: false,
      prefixEnvironmentValue: '',
    };
  }

  async componentDidMount() {
    const { selectedResource, prefixEnvironmentValue } = this.state;

    await this.getResources();
    const resourcesFilled = selectedResource !== '';
    this.setState({
      resourcesFilled: resourcesFilled,
    });

    const tooltipData = {
      type: 'error',
      content: 'Fill out all mandatory fields',
    };

    this.props.callback({
      resourcesFilled: resourcesFilled,
      selectedResource: selectedResource,
      prefixEnvironmentValue: prefixEnvironmentValue,
      tooltipData: !resourcesFilled ? tooltipData : null,
    });
  }

  componentDidUpdate(nextProps, nextState) {
    const { selectedResource, prefixEnvironmentValue } = this.state;

    if (!compareTwoObjects(this.state, nextState)) {
      const resourcesFilled = selectedResource !== '';

      this.setState({ resourcesFilled: resourcesFilled });

      const tooltipData = !resourcesFilled
        ? {
            type: 'error',
            content: 'Fill out all mandatory fields',
          }
        : null;

      this.props.callback({
        resourcesFilled: resourcesFilled,
        selectedResource: selectedResource,
        prefixEnvironmentValue: prefixEnvironmentValue,
        tooltipData: tooltipData,
      });
    }
  }

  getResources = async () => {
    this.setState({
      usageKindResourcesLoading: true,
      usageKindResources: null,
    });

    const { usageKinds } = this.props;
    let response = [];

    for (let i = 0; i < usageKinds.length; i++) {
      const usageKind = usageKinds[i];
      if (usageKind.name) {
        response.push({
          name: usageKind.name,
          items: (await this.props.fetchUsageKindResources(usageKind.name)).data
            .usageKindResources,
        });
      }
    }

    this.setState({
      usageKindResources: response,
      usageKindResourcesLoading: false,
    });
  };

  handleSelect = value => {
    this.setState({
      selectedResource: value,
    });
  };

  handleTogglePrefixButton = value => {
    this.setState({ showPrefixInput: value });
    if (value === false) {
      this.setState({ prefixEnvironmentValue: '' });
    }
  };

  handlePrefixInput = value => {
    this.setState({ prefixEnvironmentValue: value });
  };

  render() {
    const {
      selectedResource,
      usageKindResourcesLoading,
      usageKindResources,
      showPrefixInput,
      prefixEnvironmentValue,
    } = this.state;

    let groupedItems = [];

    if (usageKindResources && usageKindResources.length > 0) {
      groupedItems = usageKindResources.map((kind, index) => ({
        name: kind.name,
        items: kind.items.map((resource, index) => (
          <option
            key={index}
            value={JSON.stringify({
              kind: kind.name,
              resource: resource.name,
            })}
          >
            {resource.name}
          </option>
        )),
      }));
    }

    return (
      <div>
        {usageKindResourcesLoading && (
          <Spinner padding="20px" size="30px" color="rgba(50,54,58,0.6)" />
        )}

        <Select
          label={'Select Application'}
          handleChange={this.handleSelect}
          name={'selectedResource'}
          current={selectedResource}
          groupedItems={groupedItems}
          placeholderText={'List of applications grouped by kind'}
          firstEmptyValue
          required={true}
          noBottomMargin
        />

        <SubSectionTitle margin={'20px 0'}>
          {!showPrefixInput && (
            <Link onClick={() => this.handleTogglePrefixButton(true)}>
              {'Set environment prefix'}
              <InfoButton content={bindingVariables.setEnvPrefix} />
            </Link>
          )}
          {showPrefixInput && (
            <Link onClick={() => this.handleTogglePrefixButton(false)}>
              {'Unselect environment prefix'}
              <InfoButton content={bindingVariables.setEnvPrefix} />
            </Link>
          )}
        </SubSectionTitle>

        {showPrefixInput && (
          <Input
            label={'Prefix environment value'}
            placeholder={''}
            value={prefixEnvironmentValue}
            handleChange={this.handlePrefixInput}
            name={'prefixEnvironmentValue'}
            required={true}
            noBottomMargin
            noMessageField
          />
        )}
      </div>
    );
  }
}

export default Resources;
