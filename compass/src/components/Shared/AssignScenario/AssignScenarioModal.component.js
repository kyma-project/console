import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import _ from 'lodash';
import AssignScenarioForm from './AssignScenarioForm.container';

import { Modal, Button, Icon } from '@kyma-project/react-components';
import './style.scss';

AssignScenarioModal.propTypes = {
  entityId: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.string),
  notAssignedMessage: PropTypes.string,
  entityQuery: PropTypes.object.isRequired,

  updateScenarios: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default function AssignScenarioModal(props) {
  const [currentScenarios, setCurrentScenarios] = React.useState([]);

  function reinitializeState() {
    setCurrentScenarios(props.scenarios);
  }

  function updateCurrentScenarios(scenarios) {
    setCurrentScenarios(scenarios);
  }

  async function updateLabels() {
    const {
      scenarios,
      entityId,
      updateScenarios,
      sendNotification,
      entityQuery,
    } = props;

    if (_.isEqual(scenarios, currentScenarios)) {
      return;
    }

    try {
      await updateScenarios(entityId, currentScenarios);
      entityQuery.refetch();
      sendNotification({
        variables: {
          content: 'Scenarios updated.',
          title: 'Assigned scenarios list',
          color: '#359c46',
          icon: 'accept',
          instanceName: entityId,
        },
      });
    } catch (error) {
      console.warn(error);
      LuigiClient.uxManager().showAlert({
        text: error.message,
        type: 'error',
        closeAfter: 10000,
      });
    }
  }

  const modalOpeningComponent = (
    <Button>
      <Icon glyph="add" />
    </Button>
  );

  return (
    <Modal
      width={'400px'}
      title="Assign to Scenario"
      confirmText="Save"
      cancelText="Close"
      type={'emphasized'}
      modalOpeningComponent={modalOpeningComponent}
      onConfirm={updateLabels}
      onShow={() => {
        reinitializeState();
        LuigiClient.uxManager().addBackdrop();
      }}
      onHide={() => LuigiClient.uxManager().removeBackdrop()}
    >
      <AssignScenarioForm
        currentScenarios={currentScenarios}
        notAssignedMessage={props.notAssignedMessage}
        updateCurrentScenarios={updateCurrentScenarios}
      />
    </Modal>
  );
}
