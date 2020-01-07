import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

import { FormMessage } from 'fundamental-react';
import { FormItem, FormInput, FormLabel } from '@kyma-project/react-components';
import MultiChoiceList from '../../../Shared/MultiChoiceList/MultiChoiceList.component';

export default function CreateScenarioForm({
  applicationsQuery,
  runtimesQuery,
  updateScenarioName,
  nameError,
  updateApplications,
  applicationsToAssign,
  updateRuntimes,
  runtimesToAssign,
}) {
  if (applicationsQuery.loading || runtimesQuery.loading) {
    return 'Loading...';
  }
  if (applicationsQuery.error) {
    return `Error! ${applicationsQuery.error.message}`;
  }
  if (runtimesQuery.error) {
    return `Error! ${runtimesQuery.error.message}`;
  }

  const nonSelectedRuntimes = runtimesQuery.entities.data.filter(
    runtime => !runtimesToAssign.find(e => e.name === runtime.name),
  );

  const nonSelectedApplications = applicationsQuery.entities.data.filter(
    application => !applicationsToAssign.find(e => e.name === application.name),
  );

  return (
    <section className="create-scenario-form">
      <FormItem key="name">
        <FormLabel htmlFor="name" required>
          Name
        </FormLabel>
        <FormInput
          id="name"
          placeholder="Name"
          type="text"
          onChange={updateScenarioName}
          autoComplete="off"
        />
        {nameError && <FormMessage type="error">{nameError}</FormMessage>}
      </FormItem>
      <div>
        <p className="fd-has-font-weight-bold">Select Runtimes</p>
        <MultiChoiceList
          placeholder="Choose runtime"
          updateItems={updateRuntimes}
          currentlySelectedItems={runtimesToAssign}
          currentlyNonSelectedItems={nonSelectedRuntimes}
          notSelectedMessage=""
          noEntitiesAvailableMessage="No Runtimes available"
          itemSelector="runtimes"
          displayPropertySelector="name"
        />
      </div>
      <div>
        <p className="fd-has-font-weight-bold">Add Application</p>
        <MultiChoiceList
          placeholder="Choose application"
          updateItems={updateApplications}
          currentlySelectedItems={applicationsToAssign}
          currentlyNonSelectedItems={nonSelectedApplications}
          notSelectedMessage=""
          noEntitiesAvailableMessage="No Applications available"
          itemSelector="applications"
          displayPropertySelector="name"
        />
      </div>
    </section>
  );
}

CreateScenarioForm.propTypes = {
  applicationsQuery: PropTypes.object.isRequired,
  runtimesQuery: PropTypes.object.isRequired,

  updateScenarioName: PropTypes.func.isRequired,
  nameError: PropTypes.string,
  updateApplications: PropTypes.func.isRequired,
  applicationsToAssign: PropTypes.arrayOf(PropTypes.object.isRequired)
    .isRequired,
  updateRuntimes: PropTypes.func.isRequired,
  runtimesToAssign: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};
