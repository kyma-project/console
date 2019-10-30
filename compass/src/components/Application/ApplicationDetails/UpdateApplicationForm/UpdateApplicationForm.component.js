import React from 'react';
import PropTypes from 'prop-types';

import { FormLabel } from 'fundamental-react';
import MultiChoiceList from '../../../Shared/MultiChoiceList/MultiChoiceList.component';

import { getActualChanges } from '../../../../shared/utility';
import CustomPropTypes from '../../../../shared/typechecking/CustomPropTypes';

const formProps = {
  formElementRef: CustomPropTypes.elementRef,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
};

const gqlProps = {
  updateApplication: PropTypes.func.isRequired,
  applicationsAndLabelsQuery: PropTypes.object.isRequired,
  setApplicationLabel: PropTypes.func.isRequired,
  removeApplicationLabel: PropTypes.func.isRequired,
};

UpdateApplicationForm.propTypes = {
  application: PropTypes.object.isRequired,
  ...formProps,
  ...gqlProps,
};

export default function UpdateApplicationForm({
  application,

  formElementRef,
  onChange,
  onCompleted,
  onError,

  updateApplication,
  applicationsAndLabelsQuery,
  setApplicationLabel,
  removeApplicationLabel,
}) {
  const formValues = {
    name: React.useRef(null),
    description: React.useRef(null),
  };

  const withoutScenarios = label => label !== 'scenarios';

  const applicationAlreadyExists = name =>
    applicationsAndLabelsQuery.applications.data
      .map(app => app.name)
      .includes(name);

  const [currentLabels, setCurrentLabels] = React.useState(
    Object.keys(application.labels).filter(withoutScenarios),
  );
  const [assignedLabels, setAssignedLabels] = React.useState(currentLabels);
  const [unassignedLabels, setUnassignedLabels] = React.useState([]);

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
  }, [applicationsAndLabelsQuery.labels, assignedLabels]);

  if (applicationsAndLabelsQuery.loading) {
    return <p>Loading...</p>;
  }
  if (applicationsAndLabelsQuery.error) {
    return <p>`Error! ${applicationsAndLabelsQuery.error.message}`</p>;
  }

  const onFormChange = formEvent => {
    const name = formValues.name.current ? formValues.name.current.value : '';

    if (name !== application.name) {
      formValues.name.current.setCustomValidity(
        applicationAlreadyExists(name)
          ? 'Application with this name already exists.'
          : '',
      );
    }

    onChange(formEvent);
  };

  const collectApplicationUpdates = () => {
    const updates = [];

    const name = formValues.name.current.value;
    const description = formValues.description.current.value;
    if (name !== application.name || description !== application.description) {
      updates.push(
        updateApplication(application.id, {
          name,
          description,
          healthCheckURL: application.healthCheckURL,
        }),
      );
    }

    const [toAssign, toUnassign] = getActualChanges(
      currentLabels,
      assignedLabels,
      unassignedLabels,
    );
    return updates.concat(
      toAssign.map(label => setApplicationLabel(application.id, label, '')),
      toUnassign.map(label => removeApplicationLabel(application.id, label)),
    );
  };

  const handleFormSubmit = async e => {
    const name = formValues.name.current.value;
    e.preventDefault();
    const updates = collectApplicationUpdates();

    if (!updates.length) {
      return;
    }

    try {
      await Promise.all(updates);
      setCurrentLabels(assignedLabels);
      onCompleted(name, 'Application updated successfully');
    } catch (e) {
      console.warn(e);
      onError(`Error occured while updating Application`, e.message || ``);
    }
  };

  return (
    <form
      onChange={onFormChange}
      ref={formElementRef}
      style={{ width: '30em' }}
      onSubmit={handleFormSubmit}
    >
      <FormLabel htmlFor="application-name">Name</FormLabel>
      <input
        className="fd-has-margin-bottom-small"
        type="text"
        id="application-name"
        ref={formValues.name}
        defaultValue={application.name}
        placeholder="Application name"
        required
      />
      <FormLabel htmlFor="application-description">Description</FormLabel>
      <input
        className="fd-has-margin-bottom-small"
        type="text"
        ref={formValues.description}
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
    </form>
  );
}
