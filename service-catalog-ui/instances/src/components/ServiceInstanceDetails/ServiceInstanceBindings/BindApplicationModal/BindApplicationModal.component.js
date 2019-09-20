import React, { Fragment } from 'react';
import dcopy from 'deep-copy';
import 'core-js/es/array/flat-map';

import {
  Button,
  Modal,
  Tooltip,
  Separator,
} from '@kyma-project/react-components';

import BindingsStep from './BindingsStep.component';
import Resources from './Resources.component';
import SchemaData from './SchemaData.component';

import { bindingVariables } from '../InfoButton/variables';
import InfoButton from '../InfoButton/InfoButton.component';

import { SubSectionTitle } from './styled';

import { clearEmptyPropertiesInObject } from '../../../../commons/helpers';
import LuigiClient from '@kyma-project/luigi-client';
import NotificationsContext from '../../../../contexts/NotificationContext/NotificationContext';

class BindApplicationModal extends React.Component {
  static contextType = NotificationsContext;

  constructor(props) {
    super(props);
    this.state = {
      bindableResources: [],
      ...this.getInitialState(),
    };
  }

  getInitialState = () => {
    return {
      checkbox: true,
      selectedExistingBinding: '',
      selectedKind: '',
      selectedResource: '',
      prefixEnvironmentValue: '',
      bindingCreateParameters: {},
      bindingsStepFilled: false,
      resourcesFilled: false,
      possibilityToCreate: false,
      tooltipData: null,
    };
  };

  async componentDidMount() {
    try {
      const bindableResources = (await this.props.fetchBindableResources()).data
        .bindableResources;
      this.setState({
        bindableResources,
      });
    } catch (e) {
      console.warn(e);
    }
  }

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

    let success = true;

    try {
      let createdBindingName, createdBindingUsageName;
      if (checkbox) {
        let bindingCreateParameters;
        if (this.state.bindingCreateParameters) {
          bindingCreateParameters = dcopy(this.state.bindingCreateParameters);
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

      this.context.open({
        content: `Application binding "${createdBindingUsageName}" created successfully`,
        title: `${createdBindingUsageName}`,
        color: '#359c46',
        icon: 'accept',
        instanceName: createdBindingUsageName,
        visible: true,
      });
    } catch (e) {
      success = false;
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
    if (success) {
      this.clearState();
      LuigiClient.uxManager().removeBackdrop();
    }
  };

  handleConfirmation = () => {
    this.create();
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
      bindableResources,
      bindingsStepFilled,
      resourcesFilled,
      tooltipData,
    } = this.state;

    const { serviceInstance, usageKinds, id } = this.props;

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

    const bindingCreateParameterSchemaExists =
      bindingCreateParameterSchema &&
      (bindingCreateParameterSchema.$ref ||
        bindingCreateParameterSchema.properties);

    const content = [
      <div key={serviceInstance.name}>
        <Resources
          data={resourcesData}
          usageKinds={usageKinds.usageKinds}
          bindableResources={bindableResources}
          callback={this.callback}
        />
        {bindingCreateParameterSchemaExists && (
          <Fragment>
            <Separator margin="16px -16px" />

            <SubSectionTitle bold>
              Create Credentials
              <InfoButton content={bindingVariables.serviceBinding} />
            </SubSectionTitle>
          </Fragment>
        )}

        {bindingCreateParameterSchemaExists && (
          <Fragment>
            {!checkbox ? null : (
              <SchemaData
                data={schemaData}
                bindingCreateParameterSchema={bindingCreateParameterSchema}
                onSubmitSchemaForm={this.create}
                callback={this.callback}
              />
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
      <Button compact option="light" data-e2e-id={id} onClick={this.handleOpen}>
        + Bind Application
      </Button>
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
          <Button compact option="light" disabled={true}>
            + Bind Application
          </Button>
        </Tooltip>
      );
    }

    const createDisabledBindApplicationButton = content => (
      <Tooltip type="error" content={content} minWidth="161px">
        <Button compact data-e2e-id={id} option="light" disabled={true}>
          + Bind Application
        </Button>
      </Tooltip>
    );

    const noApplicationsAvailable =
      bindableResources && !bindableResources.flatMap(r => r.resources).length;

    if (noApplicationsAvailable) {
      return createDisabledBindApplicationButton(
        <span>There are no applications available</span>,
      );
    }

    if (!serviceInstance.serviceClass && !serviceInstance.clusterServiceClass) {
      return createDisabledBindApplicationButton(
        <span>
          Service Class does not exist. Contact the cluster administrator.
        </span>,
      );
    }

    const title = (
      <>
        <span>{'Bind Application'}</span>
        <InfoButton
          content={bindingVariables.serviceBingingUsage}
          orientation="bottom"
        />
      </>
    );

    return (
      <Modal
        width="681px"
        key={serviceInstance.name}
        type={'emphasized'}
        title={title}
        confirmText="Bind Application"
        onConfirm={this.handleConfirmation}
        modalOpeningComponent={bindApplicationButton}
        disabledConfirm={disabled}
        tooltipData={tooltipData}
        handleClose={this.clearState}
        onShow={() => LuigiClient.uxManager().addBackdrop()}
        onHide={() => LuigiClient.uxManager().removeBackdrop()}
      >
        {content}
      </Modal>
    );
  }
}

export default BindApplicationModal;
