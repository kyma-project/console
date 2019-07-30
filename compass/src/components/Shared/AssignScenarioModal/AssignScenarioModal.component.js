import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Modal, Button, Dropdown, Icon } from '@kyma-project/react-components';
import { Menu } from 'fundamental-react';
import './style.scss';

AssignScenarioModal.propTypes = {
  entityId: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.string),
  notAssignedMessage: PropTypes.string,

  scenariosQuery: PropTypes.object.isRequired,
  setScenarios: PropTypes.func.isRequired,
};

AssignScenarioModal.defaultProps = {
  notAssignedMessage: 'Entity is not assigned to any scenario.',
};

export default function AssignScenarioModal(props) {
  const [scenarios, setScenarios] = React.useState([]);

  function assignLabel(label) {
    setScenarios([...scenarios, label]);
  }

  function unassignLabel(label) {
    setScenarios(scenarios.filter(l => l !== label));
  }

  async function updateLabels() {
    const { entityId, setScenarios } = props;

    try {
      await setScenarios(entityId, scenarios);
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
    const scenariosList = !!scenarios.length ? (
      <ul>
        {scenarios.map(scenario => (
          <li className="scenario-list__list-element" key={scenario}>
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
      <p className="scenario-list__message">{props.notAssignedMessage}</p>
    );

    const allScenarios = props.scenariosQuery.scenarios.schema.items.enum;
    const availableScenarios = allScenarios
      .filter(scenario => scenarios.indexOf(scenario) === -1)
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
              {!!availableScenarios.length
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
      <>
        {scenariosList}
        {scenarioDropdown}
      </>
    );
  }

  function reinitializeState() {
    setScenarios(props.scenarios);
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
