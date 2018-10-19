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

import {
  BindApplicationButton,
  SubSectionTitle,
  SubSectionDescription,
} from './styled';

import builder from '../../../../commons/builder';
import {
  clearEmptyPropertiesInObject,
  randomNameGenerator,
} from '../../../../commons/helpers';

class BindApplicationModal extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      checkbox: this.props.serviceInstance.serviceBindings.items.length === 0,
      nameServiceBinding:
        this.props.serviceInstance.name + '-binding-' + randomNameGenerator(),
      selectedExistingBinding: '',

      nameServiceBindingUsage:
        this.props.serviceInstance.name +
        '-binding-usage-' +
        randomNameGenerator(),
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

  prepareData = params => {
    const {
      checkbox,
      nameServiceBinding,
      nameServiceBindingUsage,
      selectedExistingBinding,
      selectedResource,
      prefixEnvironmentValue,
    } = this.state;

    const parsedSelectedResource = JSON.parse(selectedResource);

    return {
      name: nameServiceBindingUsage,
      environment: builder.getCurrentEnvironmentId(),
      serviceBindingRef: {
        name: checkbox ? nameServiceBinding : selectedExistingBinding,
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
    const {
      checkbox,
      nameServiceBinding,
      nameServiceBindingUsage,
    } = this.state;
    const {
      serviceInstance,
      createBinding,
      createBindingUsage,
      serviceInstanceRefetch,
      sendNotification,
    } = this.props;
    const dataToSend = this.prepareData(params);

    try {
      if (checkbox) {
        let bindingCreateParameters;
        if (params && params.formData) {
          bindingCreateParameters = dcopy(params.formData);
          clearEmptyPropertiesInObject(bindingCreateParameters);
        } else {
          bindingCreateParameters = {};
        }
        await createBinding(
          nameServiceBinding,
          serviceInstance.name,
          bindingCreateParameters,
        );
      }
      await createBindingUsage(dataToSend);
      this.child.child.handleCloseModal();
      if (typeof sendNotification === 'function') {
        sendNotification({
          variables: {
            title: `Service binding usage "${nameServiceBindingUsage}" created successfully`,
            color: '#359c46',
            icon: '\uE05B',
            instanceName: nameServiceBindingUsage,
          },
        });
      }
      setTimeout(() => {
        if (typeof serviceInstanceRefetch === 'function') {
          serviceInstanceRefetch();
        }
      }, 1000);
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

    const bindingDescription =
      'To use ServiceInstance, you need credentials for this service. To obtain credentials, proceed with this form. One instance can have numerous credentials to use in the Deployment or Function. When you raise a credentials request, the system returns the credentials in the form of a Secret. The system creates a Secret in a given Environment.';
    const bindingUsageDescription =
      "The Secret allows you to run the service successfully. However, a problem appears each time you need to change the definition of the yaml file in the Deployment to specify the Secrets' usage. The manual process of editing the file is tedious and time-consuming. Kyma handles it by offering a custom resource called ServiceBindingUsage. This custom resource applies the Kubernetes PodPreset resource and allows you to enforce an automated flow in which the ServiceBindingUsage controller injects credentials into a given Application or Function.";

    const content = [
      <div key={serviceInstance.name}>
        <Resources
          data={resourcesData}
          usageKinds={usageKinds.usageKinds}
          fetchUsageKindResources={fetchUsageKindResources}
          callback={this.callback}
        />

        <Separator margin="16px -16px" />

        <SubSectionTitle bold>Create Credentials</SubSectionTitle>
        <SubSectionDescription>{bindingDescription}</SubSectionDescription>

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
        headerAdditionalInfo={bindingUsageDescription}
      />
    );
  }
}

export default BindApplicationModal;
