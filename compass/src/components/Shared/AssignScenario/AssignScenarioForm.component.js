import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dropdown, Icon } from '@kyma-project/react-components';
import { Menu } from 'fundamental-react';
import './style.scss';

AssignScenarioForm.propTypes = {
  currentScenarios: PropTypes.arrayOf(PropTypes.string),
  notAssignedMessage: PropTypes.string,
  availableScenariosQuery: PropTypes.object.isRequired,
  updateCurrentScenarios: PropTypes.func.isRequired,
};

AssignScenarioForm.defaultProps = {
  notAssignedMessage: 'Entity is not assigned to any scenario.',
};

export default function AssignScenarioForm({
  currentScenarios,
  updateCurrentScenarios,
  notAssignedMessage,
  availableScenariosQuery,
}) {
  function assignLabel(label) {
    updateCurrentScenarios([...currentScenarios, label]);
  }

  function unassignLabel(label) {
    updateCurrentScenarios(currentScenarios.filter(l => l !== label));
  }

  function createForm() {
    const scenariosList = currentScenarios.length ? (
      <ul>
        {currentScenarios.map(scenario => (
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
      notAssignedMessage ? <p className="assign-scenario-list__message">{notAssignedMessage}</p> : ''
    );

    const schema = availableScenariosQuery.scenarios.schema;
    const allScenarios = schema ? schema.items.enum : [];
    const availableScenarios = allScenarios
      .filter(scenario => currentScenarios.indexOf(scenario) === -1)
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

  return availableScenariosQuery.loading ? (
    <p>Loading scenarios...</p>
  ) : (
    createForm()
  );
}
