import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { Modal } from '@kyma-project/react-components';
import MultiChoiceList from '../../../../Shared/MultiChoiceList/MultiChoiceList.component';
import { getActualChanges } from '../../../../../shared/utility/getActualChanges';
import ScenarioNameContext from '../../ScenarioNameContext';

AssignEntityToScenarioModal.propTypes = {
  originalEntities: PropTypes.array.isRequired,
  getEntitiesForScenario: PropTypes.object.isRequired,

  entityName: PropTypes.oneOf(['applications', 'runtimes']),

  allEntitiesQuery: PropTypes.object.isRequired,
  updateEntitiesLabels: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default function AssignEntityToScenarioModal({
  originalEntities,
  getEntitiesForScenario,
  entityName,
  allEntitiesQuery,
  updateEntitiesLabels,
  sendNotification,
}) {
  const scenarioName = React.useContext(ScenarioNameContext);
  const uppercaseEntityName = entityName;

  const showSuccessNotification = scenarioName => {
    sendNotification({
      variables: {
        content: `Updated all ${entityName}`,
        title: `Update scenario ${scenarioName}`,
        color: '#359c46',
        icon: 'accept',
        instanceName: scenarioName,
      },
    });
  };

  const showWarningNotification = (scenarioName, rejected, all) => {
    const succeeded = all - rejected;
    sendNotification({
      variables: {
        content: `Updated ${succeeded}/${all} ${entityName}.`,
        title: `Update scenario ${scenarioName}`,
        color: '#d08014',
        icon: 'warning',
        instanceName: scenarioName,
      },
    });
  };

  const [assignedEntities, setAssignedEntities] = React.useState([]);

  React.useEffect(() => {
    setAssignedEntities(originalEntities);
    allEntitiesQuery.refetch();
  }, [originalEntities, allEntitiesQuery]);

  if (allEntitiesQuery.loading) {
    return (
      <button className="fd-button--light" disabled>
        Add {uppercaseEntityName}
      </button>
    );
  }
  if (allEntitiesQuery.error) {
    return `Error! ${allEntitiesQuery.error.message}`;
  }

  const getUnassignedEntities = () => {
    return allEntitiesQuery.entities.data.filter(
      app => !assignedEntities.filter(e => e.id === app.id).length,
    );
  };

  const updateEntities = async () => {
    try {
      const [entitiesToAssign, entitiesToUnassign] = getActualChanges(
        originalEntities,
        assignedEntities,
        getUnassignedEntities(),
      );

      const assignUpdates = entitiesToAssign.map(entity => {
        const scenarios = [scenarioName, ...(entity.labels.scenarios || [])];
        return updateEntitiesLabels(entity.id, scenarios);
      });

      const unassignUpdates = entitiesToUnassign.map(entity => {
        const scenarios = entity.labels.scenarios.filter(
          scenario => scenario !== scenarioName,
        );
        return updateEntitiesLabels(entity.id, scenarios);
      });

      const allUpdates = [...assignUpdates, ...unassignUpdates];

      if (!allUpdates.length) {
        return;
      }

      const result = await Promise.allSettled(allUpdates);

      await getEntitiesForScenario.refetch();
      await allEntitiesQuery.refetch();

      const rejected = result.filter(r => r.status === 'rejected');
      if (rejected.length) {
        showWarningNotification(scenarioName, rejected.length, result.length);
      } else {
        showSuccessNotification(scenarioName);
      }
    } catch (error) {
      console.warn(error);
      LuigiClient.uxManager().showAlert({
        text: error.message,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  const modalOpeningComponent = (
    <button className="fd-button--light">Add {uppercaseEntityName}</button>
  );

  return (
    <Modal
      width={'400px'}
      title={`Assign ${entityName} to scenario`}
      confirmText="Save"
      cancelText="Cancel"
      type={'emphasized'}
      modalOpeningComponent={modalOpeningComponent}
      onConfirm={updateEntities}
      onShow={LuigiClient.uxManager().addBackdrop}
      onHide={LuigiClient.uxManager().removeBackdrop}
    >
      <MultiChoiceList
        currentlySelectedItems={assignedEntities}
        currentlyNonSelectedItems={getUnassignedEntities()}
        notSelectedMessage={`No ${entityName} selected`}
        updateItems={assigned => setAssignedEntities(assigned)}
        placeholder={`Choose ${entityName}`}
        displayPropertySelector="name"
      />
    </Modal>
  );
}
