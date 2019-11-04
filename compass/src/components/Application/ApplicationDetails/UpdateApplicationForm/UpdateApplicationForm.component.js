import React from 'react';
import PropTypes from 'prop-types';

import { FormLabel } from 'fundamental-react';
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
  applicationsQuery,
}) {
  const formValues = {
    name: React.useRef(null),
    description: React.useRef(null),
  };

  const applicationAlreadyExists = name =>
    applicationsQuery.applications.data.map(app => app.name).includes(name);

  if (applicationsQuery.loading) {
    return <p>Loading...</p>;
  }
  if (applicationsQuery.error) {
    return <p>`Error! ${applicationsQuery.error.message}`</p>;
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

  const handleFormSubmit = async e => {
    e.preventDefault();

    const name = formValues.name.current.value;
    const description = formValues.description.current.value;
    if (name === application.name && description === application.description) {
      return;
    }

    try {
      await updateApplication(application.id, {
        name,
        description,
        healthCheckURL: application.healthCheckURL,
      });
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
    </form>
  );
}
