import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Modal, Button, Dropdown, Icon } from '@kyma-project/react-components';
import { Menu } from 'fundamental-react';
import './style.scss';

ApplicationScenarioModal.propTypes = {
  applicationId: PropTypes.string.isRequired,
  applicationScenarios: PropTypes.arrayOf(PropTypes.string),

  scenariosQuery: PropTypes.object.isRequired,
  setScenarios: PropTypes.func.isRequired,
};

export default function ApplicationScenarioModal(props) {
  const [applicationScenarios, setApplicationScenarios] = React.useState([]);

  function assignLabel(label) {
    setApplicationScenarios([...applicationScenarios, label]);
  }

  function unassignLabel(label) {
    setApplicationScenarios(applicationScenarios.filter(l => l !== label));
  }

  async function updateLabels() {
    const { applicationId, setScenarios } = props;

    try {
      await setScenarios(applicationId, applicationScenarios);
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
    const applicationScenariosList = !!applicationScenarios.length ? (
      <ul>
        {applicationScenarios.map(scenario => (
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
      <p className="scenario-list__message">
        {'Application is not assigned to any scenario.'}
      </p>
    );

    const allScenarios = props.scenariosQuery.scenarios.schema.items.enum;
    const availableScenarios = allScenarios
      .filter(scenario => applicationScenarios.indexOf(scenario) === -1)
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
        {applicationScenariosList}
        {scenarioDropdown}
      </>
    );
  }

  function reinitializeState() {
    setApplicationScenarios(props.applicationScenarios);
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
