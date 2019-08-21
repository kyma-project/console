import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Modal, Button } from '@kyma-project/react-components';

import CreateScenarioForm from './../CreateScenarioForm/CreateScenarioForm.container';

export default class CreateScenarioModal extends React.Component {
  state = {
    name: '',
    nameError: '',
    applicationsToAssign: [],
    runtimesToAssign: [],
  };

  checkScenarioAlreadyExists = scenarioName => {
    const scenariosQuery = this.props.scenariosQuery;
    return (
      !!scenariosQuery.error || // scenariosQuery.error means there were no scenarios yet
      scenariosQuery.labelDefinition.schema.items.enum.includes(scenarioName)
    );
  };

  updateScenarioName = e => {
    const scenarioName = e.target.value;
    this.setState({ name: scenarioName });

    if (this.checkScenarioAlreadyExists(scenarioName)) {
      this.setState({
        nameError: 'Scenario with this name already exists.',
      });
    } else {
      this.setState({ nameError: '' });
    }
  };

  updateApplications = assignedApplications => {
    this.setState({ applicationsToAssign: assignedApplications });
  };

  updateRuntimes = assignedRuntimes => {
    this.setState({ runtimesToAssign: assignedRuntimes });
  };

  disabledConfirm = () => {
    const { name, nameError } = this.state;
    return !name.trim() || nameError;
  };

  addScenarioAndAssignEntries = async () => {
    try {
      await this.addScenario();
      await this.assignEntries();
    } catch (e) {
      console.warn(e);
      this.showError(e);
    }
  };

  addScenario = async () => {
    const { scenariosQuery, createScenarios, addScenario } = this.props;
    const scenarioName = this.state.name;

    if (scenariosQuery.error) {
      await createScenarios([scenarioName]);
    } else {
      const currentScenarios = scenariosQuery.labelDefinition.schema.items.enum;
      await addScenario(currentScenarios, scenarioName);
    }
    scenariosQuery.refetch();
  };

  assignEntries = async () => {
    const { setApplicationScenarios, setRuntimeScenarios } = this.props;
    const {
      name: scenarioName,
      applicationsToAssign,
      runtimesToAssign,
    } = this.state;
    const applicationUpdates = applicationsToAssign.map(application => {
      const labels = application.labels.scenarios || [];
      return setApplicationScenarios(application.id, [...labels, scenarioName]);
    });
    const runtimeUpdates = runtimesToAssign.map(runtime => {
      const labels = runtime.labels.scenarios || [];
      return setRuntimeScenarios(runtime.id, [...labels, scenarioName]);
    });

    const result = await Promise.allSettled([
      ...applicationUpdates,
      ...runtimeUpdates,
    ]);

    const rejected = result.filter(r => r.status === 'rejected');
    if (rejected.length) {
      this.showWarningNotification(
        scenarioName,
        rejected.length,
        result.length,
      );
    } else {
      this.showSuccessNotification(scenarioName);
    }
  };

  showError(error) {
    LuigiClient.uxManager().showAlert({
      text: error.message,
      type: 'error',
      closeAfter: 10000,
    });
  }

  showSuccessNotification = scenarioName => {
    this.props.sendNotification({
      variables: {
        content: `Created scenario ${scenarioName}.`,
        title: `${scenarioName}`,
        color: '#359c46',
        icon: 'accept',
        instanceName: scenarioName,
      },
    });
  };

  showWarningNotification = (scenarioName, rejected, all) => {
    const succeeded = all - rejected;
    this.props.sendNotification({
      variables: {
        content: `Scenario created and assigned to ${succeeded}/${all} entries.`,
        title: `${scenarioName}`,
        color: '#d08014',
        icon: 'warning',
        instanceName: scenarioName,
      },
    });
  };

  render() {
    const modalOpeningComponent = <Button glyph="add">Create Scenario</Button>;

    return (
      <Modal
        width={'400px'}
        title="Create scenario"
        confirmText="Save"
        cancelText="Close"
        type={'emphasized'}
        disabledConfirm={this.disabledConfirm()}
        modalOpeningComponent={modalOpeningComponent}
        onConfirm={this.addScenarioAndAssignEntries}
        onShow={() => LuigiClient.uxManager().addBackdrop()}
        onHide={() => LuigiClient.uxManager().removeBackdrop()}
      >
        <CreateScenarioForm
          updateScenarioName={this.updateScenarioName}
          nameError={this.state.nameError}
          updateApplications={this.updateApplications}
          updateRuntimes={this.updateRuntimes}
        />
      </Modal>
    );
  }
}

CreateScenarioModal.propTypes = {
  scenariosQuery: PropTypes.object.isRequired,
  createScenarios: PropTypes.func.isRequired,
  addScenario: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,

  setRuntimeScenarios: PropTypes.func.isRequired,
  setApplicationScenarios: PropTypes.func.isRequired,
};
