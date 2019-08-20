import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import _ from 'lodash';

import { Modal, Button, Icon } from '@kyma-project/react-components';
import MultiChoiceList from '../../Shared/MultiChoiceList/MultiChoiceList.component';

AssignScenarioModal.propTypes = {
  entityId: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.string),
  availableScenariosQuery: PropTypes.object.isRequired,
  notSelectedMessage: PropTypes.string,
  entityQuery: PropTypes.object.isRequired,
  title: PropTypes.string,

  updateScenarios: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

AssignScenarioModal.defaultProps = {
  title: 'Assign to Scenario',
};

export default function AssignScenarioModal(props) {
  const [currentScenarios, setCurrentScenarios] = React.useState([]);

  function reinitializeState() {
    setCurrentScenarios(props.scenarios);
  }

  function updateCurrentScenarios(scenariosToAssign) {
    setCurrentScenarios(scenariosToAssign);
  }

  async function updateLabels() {
    const {
      title,
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
          content: 'List of scenarios updated.',
          title,
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

  const { loading, error, scenarios } = props.availableScenariosQuery;

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const availableScenarios = scenarios.schema.items.enum.filter(
    scenario => !currentScenarios.includes(scenario),
  );

  return (
    <Modal
      width={'400px'}
      title={props.title}
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
      <MultiChoiceList
        currentlySelectedItems={currentScenarios}
        currentlyNonSelectedItems={availableScenarios}
        notSelectedMessage={props.notSelectedMessage}
        updateItems={updateCurrentScenarios}
        placeholder="Choose scenario..."
      />
    </Modal>
  );
}
