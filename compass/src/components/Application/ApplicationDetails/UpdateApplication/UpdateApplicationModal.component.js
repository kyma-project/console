import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { Modal, Button } from '@kyma-project/react-components';
import { FormMessage, FormLabel, FormInput, FormSet } from 'fundamental-react';
import MultiChoiceList from './../../../Shared/MultiChoiceList/MultiChoiceList.component';

import { areArraysEqual, getActualChanges } from './../../../../shared/utility';
import { ApplicationQueryContext } from './../ApplicationDetails.component';

UpdateApplicationModal.propTypes = {
  application: PropTypes.object.isRequired,
  updateApplicationMutation: PropTypes.func.isRequired,
  applicationsAndLabelsQuery: PropTypes.object.isRequired,
  setApplicationLabel: PropTypes.func.isRequired,
  removeApplicationLabel: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default function UpdateApplicationModal({
  application,
  updateApplicationMutation,
  applicationsAndLabelsQuery,
  setApplicationLabel,
  removeApplicationLabel,
  sendNotification,
}) {
  const applicationQuery = React.useContext(ApplicationQueryContext);

  const withoutScenarios = label => label !== 'scenarios';

  const applicationAlreadyExists = name =>
    applicationsAndLabelsQuery.applications &&
    applicationsAndLabelsQuery.applications.data.filter(
      app => app.name === name && app.name !== application.name,
    ).length;

  const [isValid, setValid] = React.useState(false);
  const [name, setName] = React.useState(application.name);
  const [nameError, setNameError] = React.useState('');
  const [description, setDescription] = React.useState(application.description);
  const [currentLabels, setCurrentLabels] = React.useState(
    Object.keys(application.labels).filter(withoutScenarios),
  );
  const [assignedLabels, setAssignedLabels] = React.useState(currentLabels);
  const [unassignedLabels, setUnassignedLabels] = React.useState([]);

  const checkFormValidity = () => {
    if (!name.trim()) {
      setValid(false);
      return;
    }

    if (applicationAlreadyExists(name)) {
      setNameError('Application name must be unique.');
      setValid(false);
      return;
    } else {
      setNameError('');
    }

    const nameChanged = name !== application.name;
    const descriptionChanged = description !== application.description;
    const labelsChanged = !areArraysEqual(currentLabels, assignedLabels);

    setValid(nameChanged || descriptionChanged || labelsChanged);
  };

  React.useEffect(() => {
    const labels = applicationsAndLabelsQuery.labels;
    if (labels) {
      setUnassignedLabels(
        labels
          .map(l => l.key)
          .filter(withoutScenarios)
          .filter(l => !assignedLabels.includes(l)),
      );
    }
  }, [applicationsAndLabelsQuery.labels, application, assignedLabels]);

  React.useEffect(checkFormValidity, [
    name,
    description,
    currentLabels,
    assignedLabels,
    unassignedLabels,
  ]);

  if (applicationsAndLabelsQuery.loading) {
    return <p>Loading...</p>;
  }
  if (applicationsAndLabelsQuery.error) {
    return <p>`Error! ${applicationsAndLabelsQuery.error.message}`</p>;
  }

  const updateApplication = async () => {
    const updates = [];
    if (name !== application.name || description !== application.description) {
      updates.push(
        updateApplicationMutation(application.id, {
          name,
          description,
          healthCheckURL: application.healthCheckURL,
        }),
      );
    }

    if (!areArraysEqual(currentLabels, assignedLabels)) {
      const [toAssign, toUnassign] = getActualChanges(
        currentLabels,
        assignedLabels,
        unassignedLabels,
      );
      updates.concat(
        toAssign.map(label => setApplicationLabel(application.id, label, '')),
        toUnassign.map(label => removeApplicationLabel(application.id, label)),
      );
    }

    try {
      await Promise.all(updates);
      await applicationQuery.refetch();
      setCurrentLabels(assignedLabels);
      sendNotification({
        variables: {
          content: `Updated application "${application.name}".`,
          title: application.name,
          color: '#359c46',
          icon: 'accept',
          instanceName: application.name,
        },
      });
    } catch (e) {
      console.warn(e);
      LuigiClient.uxManager().showAlert({
        text: `Error occured while updating application: ${e.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  const content = (
    <FormSet>
      <FormLabel htmlFor="application-name">Name</FormLabel>
      <FormInput
        onChange={e => setName(e.target.value)}
        className="fd-has-margin-bottom-small"
        type="text"
        id="application-name"
        defaultValue={application.name}
        placeholder="Application name"
      />
      {nameError && <FormMessage type="error">{nameError}</FormMessage>}
      <FormLabel htmlFor="application-description">Description</FormLabel>
      <FormInput
        onChange={e => setDescription(e.target.value)}
        className="fd-has-margin-bottom-small"
        type="text"
        id="application-description"
        defaultValue={application.description}
        placeholder="Application description"
      />
      <FormLabel>Labels</FormLabel>
      <MultiChoiceList
        updateItems={(assigned, notAssigned) => {
          setAssignedLabels(assigned);
          setUnassignedLabels(notAssigned);
        }}
        currentlySelectedItems={assignedLabels}
        currentlyNonSelectedItems={unassignedLabels}
        noEntitiesAvailableMessage="No more labels available"
        notSelectedMessage="No labels selected"
      />
    </FormSet>
  );

  return (
    <Modal
      width={'480px'}
      title="Edit Application"
      confirmText="Edit"
      type={'emphasized'}
      modalOpeningComponent={<Button option="light">Edit</Button>}
      onConfirm={updateApplication}
      disabledConfirm={!isValid}
      onShow={LuigiClient.uxManager().addBackdrop}
      onHide={LuigiClient.uxManager().removeBackdrop}
    >
      {content}
    </Modal>
  );
}
