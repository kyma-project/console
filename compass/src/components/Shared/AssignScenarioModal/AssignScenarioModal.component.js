import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import _ from 'lodash';

import { Modal, Button, Dropdown, Icon } from '@kyma-project/react-components';
import { Menu } from 'fundamental-react';
import './style.scss';

AssignScenarioModal.propTypes = {
  entityId: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.string),
  notAssignedMessage: PropTypes.string,
  entityQuery: PropTypes.object.isRequired,

  scenariosQuery: PropTypes.object.isRequired,
  updateScenarios: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

AssignScenarioModal.defaultProps = {
  notAssignedMessage: 'Entity is not assigned to any scenario.',
};

export default function AssignScenarioModal(props) {
  const [editedScenarios, setEditedScenarios] = React.useState([]);

  function assignLabel(label) {
    setEditedScenarios([...editedScenarios, label]);
  }

  function unassignLabel(label) {
    setEditedScenarios(editedScenarios.filter(l => l !== label));
  }

  async function updateLabels() {
    const {
      scenarios,
      entityId,
      updateScenarios,
      sendNotification,
      entityQuery,
    } = props;

    if (_.isEqual(scenarios, editedScenarios)) {
      return;
    }

    try {
      await updateScenarios(entityId, editedScenarios);
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

  function createModalContent() {
    const scenariosList = editedScenarios.length ? (
      <ul>
        {editedScenarios.map(scenario => (
          <li className="assign-scenario-list__list-element" key={scenario}>
            <span>{scenario}</span>
            <Button
              option="light"
              type="negative"
              onClick={() => unassignLabel(scenario)}
            >
              <Icon size="l" glyph="decline" />
            </Button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="assign-scenario-list__message">
        {props.notAssignedMessage}
      </p>
    );

    const allScenarios = props.scenariosQuery.scenarios.schema.items.enum;
    const availableScenarios = allScenarios
      .filter(scenario => editedScenarios.indexOf(scenario) === -1)
      .map(scenario => (
        <Menu.Item onClick={e => assignLabel(e.target.textContent)}>
          {scenario}
        </Menu.Item>
      ));

    const scenarioDropdown = (
      <Dropdown
        control={
          <Button dropdown>
            <span>
              {availableScenarios.length
                ? 'Choose scenario'
                : 'No scenarios available'}
            </span>
          </Button>
        }
        placement="bottom"
      >
        {availableScenarios}
      </Dropdown>
    );

    return (
      <section className="assign-scenario-modal__body">
        {scenariosList}
        {scenarioDropdown}
      </section>
    );
  }

  function reinitializeState() {
    setEditedScenarios(props.scenarios);
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
      {props.scenariosQuery.loading ? (
        <p>Loading scenarios...</p>
      ) : (
        createModalContent()
      )}
    </Modal>
  );
}
