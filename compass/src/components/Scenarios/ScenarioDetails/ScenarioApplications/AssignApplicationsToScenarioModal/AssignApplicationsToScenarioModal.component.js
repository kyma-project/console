import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { Modal } from '@kyma-project/react-components';
import MultiChoiceList from '../../../../Shared/MultiChoiceList/MultiChoiceList.component';
import { getActualChanges } from './../../shared/getActualChanges';

AssignApplicationsToScenarioModal.propTypes = {
  scenarioName: PropTypes.string.isRequired,
  originalApplications: PropTypes.array.isRequired,
  getApplicationsForScenarioQuery: PropTypes.object.isRequired,

  getAllApplicationsQuery: PropTypes.object.isRequired,
  updateApplicationLabels: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default function AssignApplicationsToScenarioModal({
  scenarioName,
  originalApplications,
  getApplicationsForScenarioQuery,
  allApplicationsQuery,
  updateApplicationLabels,
  sendNotification,
}) {
  const showSuccessNotification = scenarioName => {
    sendNotification({
      variables: {
        content: `Updated all applications`,
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
        content: `Updated ${succeeded}/${all} applications.`,
        title: `Update scenario ${scenarioName}`,
        color: '#d08014',
        icon: 'warning',
        instanceName: scenarioName,
      },
    });
  };

  const [assignedApplications, setAssignedApplications] = React.useState([]);

  React.useEffect(() => {
    setAssignedApplications(originalApplications);
    allApplicationsQuery.refetch();
  }, [originalApplications]);

  if (allApplicationsQuery.loading) {
    return <p>Loading...</p>;
  }
  if (allApplicationsQuery.error) {
    return `Error! ${allApplicationsQuery.error.message}`;
  }

  const getUnassignedApplications = () => {
    return allApplicationsQuery.applications.data.filter(
      app => !assignedApplications.filter(e => e.id === app.id).length,
    );
  };

  const updateApplications = async () => {
    try {
      const [applicationsToAssign, applicationsToUnassign] = getActualChanges(
        originalApplications,
        assignedApplications,
        getUnassignedApplications(),
      );

      const assignUpdates = applicationsToAssign.map(application => {
        const scenarios = [scenarioName, ...application.labels.scenarios];
        return updateApplicationLabels(application.id, scenarios);
      });

      const unassignUpdates = applicationsToUnassign.map(application => {
        const scenarios = application.labels.scenarios.filter(
          scenario => scenario !== scenarioName,
        );
        return updateApplicationLabels(application.id, scenarios);
      });

      const allUpdates = [...assignUpdates, ...unassignUpdates];

      if (!allUpdates.length) {
        return;
      }

      const result = await Promise.allSettled(allUpdates);

      await getApplicationsForScenarioQuery.refetch();
      await allApplicationsQuery.refetch();

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

  return (
    <Modal
      width={'400px'}
      title="Assign applications to scenario"
      confirmText="Save"
      cancelText="Cancel"
      type={'emphasized'}
      modalOpeningComponent={
        <button className="fd-button--light">Add Application</button>
      }
      onConfirm={updateApplications}
      onShow={LuigiClient.uxManager().addBackdrop}
      onHide={LuigiClient.uxManager().removeBackdrop}
    >
      <MultiChoiceList
        currentlySelectedItems={assignedApplications}
        currentlyNonSelectedItems={getUnassignedApplications()}
        notSelectedMessage="No applications selected"
        updateItems={assigned => setAssignedApplications(assigned)}
        placeholder="Choose applications"
        displayPropertySelector="name"
      />
    </Modal>
  );
}
