import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Button, Icon } from '@kyma-project/react-components';
import MultiChoiceList from './../../../Shared/MultiChoiceList/MultiChoiceList.component';

AssignScenarioModal.propTypes = {
  scenarioName: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.string),
  notSelectedMessage: PropTypes.string,
  title: PropTypes.string, // choose apps or choose runtimes

  availableScenariosQuery: PropTypes.object.isRequired,
  // updateScenarios: PropTypes.func.isRequired,
  // sendNotification: PropTypes.func.isRequired,
};

AssignScenarioModal.defaultProps = {
  title: 'Assign to Scenario',
};

export default function AssignToScenarioModal() {
  const [currentEntities, setCurrentEntities] = React.useState([]);

  // function reinitializeState() {
  //   setCurrentScenarios(props.scenarios);
  // }

  function setCurrentEntities(entitiesToBeAssigned) {
    setCurrentScenarios(scenariosToAssign);
  }

  const modalOpeningComponent = <span className="link">Add Application</span>;

  return (
    <Modal
      width={'400px'}
      title={props.title}
      confirmText="Save"
      cancelText="Close"
      type={'emphasized'}
      modalOpeningComponent={modalOpeningComponent}
      onConfirm={updateLabels}
      onShow={() => LuigiClient.uxManager().addBackdrop()}
      onHide={() => LuigiClient.uxManager().removeBackdrop()}
    >
      <MultiChoiceList
        currentlySelectedItems={currentScenarios}
        currentlyNonSelectedItems={availableScenarios}
        notSelectedMessage={props.notSelectedMessage}
        updateItems={updateCurrentApplications}
        placeholder="Choose scenario..."
      />
    </Modal>
  );
}
