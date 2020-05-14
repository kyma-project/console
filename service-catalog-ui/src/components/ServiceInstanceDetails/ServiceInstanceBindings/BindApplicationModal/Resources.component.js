import React from 'react';

import { Input, Select, Spinner } from '@kyma-project/react-components';

import deepEqual from 'deep-equal';

import { bindingVariables } from '../InfoButton/variables';
import InfoButton from '../InfoButton/InfoButton.component';

import { Link, SubSectionTitle } from './styled';

class Resources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedResource: props.data.selectedResource,
      resourcesFilled: props.data.resourcesFilled,
      bindableResources: props.data.bindableResources,
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

    if (!deepEqual(this.state, nextState)) {
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

  getResources = () => {
    this.setState({
      usageKindResourcesLoading: true,
      bindableResources: null,
    });

    const { usageKinds } = this.props;
    let response = [];
    for (let i = 0; i < usageKinds.length; i++) {
      const usageKind = usageKinds[i];
      let resources = [];
      this.props.bindableResources.forEach(res => {
        if (res.kind === usageKind.name && res.resources.length > 0) {
          resources = res.resources;
        }
      });

      if (usageKind.name && resources.length > 0) {
        response.push({
          name: usageKind.name,
          displayName: usageKind.displayName,
          items: resources,
        });
      }
    }

    this.setState({
      bindableResources: response,
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
      bindableResources,
      showPrefixInput,
      prefixEnvironmentValue,
    } = this.state;

    let groupedItems = [];

    if (bindableResources && bindableResources.length > 0) {
      groupedItems = bindableResources.map(kind => ({
        name: kind.displayName,
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
        {usageKindResourcesLoading && <Spinner />}

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
            <Link
              data-e2e-id="set-prefix"
              onClick={() => this.handleTogglePrefixButton(true)}
            >
              {'Set prefix for injected variables'}
              <InfoButton content={bindingVariables.setEnvPrefix} />
            </Link>
          )}
          {showPrefixInput && (
            <Link
              data-e2e-id="unset-prefix"
              onClick={() => this.handleTogglePrefixButton(false)}
            >
              {'Unselect namespace prefix'}
              <InfoButton content={bindingVariables.setEnvPrefix} />
            </Link>
          )}
        </SubSectionTitle>

        {showPrefixInput && (
          <Input
            label={'Prefix namespace value'}
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
