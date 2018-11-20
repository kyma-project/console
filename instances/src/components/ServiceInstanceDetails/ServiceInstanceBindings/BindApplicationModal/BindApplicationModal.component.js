import React, { Fragment } from 'react';
import dcopy from 'deep-copy';

import {
  ConfirmationModal,
  Tooltip,
  Separator,
} from '@kyma-project/react-components';

import BindingsStep from './BindingsStep.component';
import Resources from './Resources.component';
import SchemaData from './SchemaData.component';

import { bindingVariables } from '../InfoButton/variables';
import InfoButton from '../InfoButton/InfoButton.component';

import { BindApplicationButton, SubSectionTitle } from './styled';

import builder from '../../../../commons/builder';
import { clearEmptyPropertiesInObject } from '../../../../commons/helpers';

class BindApplicationModal extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      checkbox: true,
      selectedExistingBinding: '',
      selectedKind: '',
      selectedResource: '',
      prefixEnvironmentValue: '',
      usageKindResources: null,
      bindingCreateParameters: {},
      bindingsStepFilled: false,
      resourcesFilled: false,
      possibilityToCreate: false,
      tooltipData: null,
    };
  };

  clearState = () => {
    this.setState(this.getInitialState());
  };

  componentDidUpdate(nextProps, nextState) {
    if (nextState && nextState.tooltipData && nextState.tooltipData.show) {
      this.setState({
        tooltipData: null,
      });
    }
  }

  componentWillUnmount() {
    this.clearState();
  }

  callback = data => {
    this.setState({ ...data });
  };

  prepareData = createdBindingName => {
    const {
      checkbox,
      selectedExistingBinding,
      selectedResource,
      prefixEnvironmentValue,
    } = this.state;

    const parsedSelectedResource = JSON.parse(selectedResource);

    return {
      environment: builder.getCurrentEnvironmentId(),
      serviceBindingRef: {
        name: checkbox ? createdBindingName : selectedExistingBinding,
      },
      usedBy: {
        kind: parsedSelectedResource.kind.split(' ')[0],
        name: parsedSelectedResource.resource,
      },
      parameters: {
        envPrefix: {
          name: prefixEnvironmentValue,
        },
      },
    };
  };

  create = async params => {
    const { checkbox } = this.state;
    const {
      serviceInstance,
      createBinding,
      createBindingUsage,
      sendNotification,
    } = this.props;

    try {
      let createdBindingName, createdBindingUsageName;
      if (checkbox) {
        let bindingCreateParameters;
        if (params && params.formData) {
          bindingCreateParameters = dcopy(params.formData);
          clearEmptyPropertiesInObject(bindingCreateParameters);
        } else {
          bindingCreateParameters = {};
        }
        const createdBinding = await createBinding(
          serviceInstance.name,
          bindingCreateParameters,
        );

        if (
          createdBinding &&
          createdBinding.data &&
          createdBinding.data.createServiceBinding &&
          createdBinding.data.createServiceBinding.name
        ) {
          createdBindingName = createdBinding.data.createServiceBinding.name;
        }
      }
      const dataToSend = this.prepareData(createdBindingName);
      const createdBindingUsage = await createBindingUsage(dataToSend);
      if (
        createdBindingUsage &&
        createdBindingUsage.data &&
        createdBindingUsage.data.createServiceBindingUsage &&
        createdBindingUsage.data.createServiceBindingUsage.name
      ) {
        createdBindingUsageName =
          createdBindingUsage.data.createServiceBindingUsage.name;
      }

      this.child.child.handleCloseModal();
      if (typeof sendNotification === 'function') {
        sendNotification({
          variables: {
            content: `Application binding "${createdBindingUsageName}" created successfully`,
            title: `${createdBindingUsageName}`,
            color: '#359c46',
            icon: '\uE05B',
            instanceName: createdBindingUsageName,
          },
        });
      }
    } catch (e) {
      this.setState({
        tooltipData: {
          type: 'error',
          title: 'Error occored during creation',
          content: e.message,
          show: true,
          minWidth: '261px',
        },
      });
    }
  };

  handleConfirmation = () => {
    if (this.submitBtn) {
      this.submitBtn.click();
    } else {
      this.create();
    }
  };

  handleOpen = () => {
    this.props.usageKinds.refetch();
  };

  render() {
    const {
      checkbox,
      selectedExistingBinding,
      selectedKind,
      selectedResource,
      prefixEnvironmentValue,
      bindingCreateParameters,

      bindingsStepFilled,
      resourcesFilled,
      tooltipData,
    } = this.state;

    const {
      serviceInstance,
      usageKinds,
      fetchUsageKindResources,
      id,
    } = this.props;

    const servicePlan =
      (serviceInstance &&
        (serviceInstance.servicePlan || serviceInstance.clusterServicePlan)) ||
      [];
    const bindingCreateParameterSchema =
      (servicePlan && servicePlan.bindingCreateParameterSchema) || null;

    const disabled = !bindingsStepFilled || !resourcesFilled;

    const resourcesData = {
      resourcesFilled: bindingsStepFilled,
      selectedKind: selectedKind,
      selectedResource: selectedResource,
      prefixEnvironmentValue: prefixEnvironmentValue,
    };

    const schemaData = {
      bindingCreateParameters: bindingCreateParameters,
    };

    const bindingsStepData = {
      checkbox: checkbox,
      selectedExistingBinding: selectedExistingBinding,
      bindingsStepFilled: bindingsStepFilled,
    };

    const content = [
      <div key={serviceInstance.name}>
        <Resources
          data={resourcesData}
          usageKinds={usageKinds.usageKinds}
          fetchUsageKindResources={fetchUsageKindResources}
          callback={this.callback}
        />
        {bindingCreateParameterSchema && (
          <Fragment>
            <Separator margin="16px -16px" />

            <SubSectionTitle bold>
              Create Credentials
              <InfoButton content={bindingVariables.serviceBinding} />
            </SubSectionTitle>
          </Fragment>
        )}

        {bindingCreateParameterSchema && (
          <Fragment>
            {[
              bindingCreateParameterSchema &&
                !bindingCreateParameterSchema.properties,
            ] && !checkbox ? null : (
              <SchemaData
                data={schemaData}
                bindingCreateParameterSchema={bindingCreateParameterSchema}
                onSubmitSchemaForm={this.create}
                callback={this.callback}
              >
                {/* Styled components don't work here */}
                <button
                  className="hidden"
                  type="submit"
                  ref={submitBtn => (this.submitBtn = submitBtn)}
                >
                  Submit
                </button>
              </SchemaData>
            )}
          </Fragment>
        )}
        <BindingsStep
          data={bindingsStepData}
          existingServiceBindings={serviceInstance.serviceBindings.items}
          showInfo={bindingCreateParameterSchema ? true : false}
          callback={this.callback}
        />
      </div>,
    ];

    const bindApplicationButton = (
      <BindApplicationButton data-e2e-id={id} onClick={this.handleOpen}>
        + Bind Application
      </BindApplicationButton>
    );

    if (serviceInstance.status.type !== 'RUNNING') {
      return (
        <Tooltip
          type="error"
          content={
            <span>
              Instance must be in a <strong>Running</strong> state
            </span>
          }
          minWidth="161px"
        >
          <BindApplicationButton disabled={true}>
            + Bind Application
          </BindApplicationButton>
        </Tooltip>
      );
    }

    if (!serviceInstance.serviceClass && !serviceInstance.clusterServiceClass) {
      return (
        <Tooltip
          type="error"
          content={
            <span>
              Service Class does not exist. Contact the cluster administrator.
            </span>
          }
          minWidth="161px"
        >
          <BindApplicationButton disabled={true}>
            + Bind Application
          </BindApplicationButton>
        </Tooltip>
      );
    }

    return (
      <ConfirmationModal
        ref={modal => {
          this.child = modal;
        }}
        key={serviceInstance.name}
        title={'Bind Application'}
        confirmText="Create"
        cancelText="Cancel"
        content={content}
        handleConfirmation={this.handleConfirmation}
        modalOpeningComponent={bindApplicationButton}
        disabled={disabled}
        tooltipData={tooltipData}
        borderFooter={true}
        handleClose={this.clearState}
        headerAdditionalInfo={bindingVariables.serviceBingingUsage}
      />
    );
  }
}

export default BindApplicationModal;
