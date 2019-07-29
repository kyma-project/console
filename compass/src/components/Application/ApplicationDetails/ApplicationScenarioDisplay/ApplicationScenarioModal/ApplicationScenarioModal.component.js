import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Modal, Button } from '@kyma-project/react-components';
import { Icon } from 'fundamental-react';
import './style.scss';

//todo cleanup
import { Dropdown, Popover, Menu } from 'fundamental-react';

export default class ApplicationScenarioModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      availableScenarios: [],
      applicationScenarios: []
    }

    this.createContent = this.createContent.bind(this);
  }

  createContent() {
    const applicationScenariosList = (
      <ul>
        {this.state.applicationScenarios.map(
          scenario => (
            <li className="scenario-list__list-element" key={scenario}>
              <span>{scenario}</span>
              <Button option="light" type="negative">
                <Icon size="l" glyph="decline" />
              </Button>
            </li>
          ),
        )}
      </ul>
    );
    const availableScenarios = this.props.scenariosQuery.scenarios.schema.items.enum;


    const scenarioDropdown = (
      <Dropdown>
        <Popover
          body={
            <Menu>
              <Menu.List>
                {availableScenarios.filter(
                  s => this.state.applicationScenarios.indexOf(s) === -1,
                )
                .map(s => <Menu.Item url="/">s</Menu.Item>
                )}
              </Menu.List>
            </Menu>
          }
          control={<Button dropdown>Select</Button>}
          id="jhqD0555"
          noArrow
        />
      </Dropdown>
    );

    return (
      <>
        {applicationScenariosList}
        {scenarioDropdown}
      </>
    );
  }

  render() {
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
        onConfirm={() => {}}
        onShow={() => LuigiClient.uxManager().addBackdrop()}
        onHide={() => LuigiClient.uxManager().removeBackdrop()}
      >
        {this.props.scenariosQuery.loading ? (
          <p>Loading scenarios...</p>
        ) : (
          this.createContent()
        )}
      </Modal>
    );
  }
}

ApplicationScenarioModal.propTypes = {
  applicationId: PropTypes.string.isRequired,
  applicationScenarios: PropTypes.arrayOf(PropTypes.string),
  scenariosQuery: PropTypes.object.isRequired,
};
