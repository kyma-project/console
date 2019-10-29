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
  updateRuntimes,
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
          currentlySelectedItems={[]}
          currentlyNonSelectedItems={runtimesQuery.entities.data}
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
          currentlySelectedItems={[]}
          currentlyNonSelectedItems={applicationsQuery.entities.data}
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
  updateRuntimes: PropTypes.func.isRequired,
};
