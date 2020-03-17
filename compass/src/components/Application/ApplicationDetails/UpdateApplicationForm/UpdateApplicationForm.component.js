import React from 'react';
import PropTypes from 'prop-types';

import { FormLabel } from 'fundamental-react';
import { CustomPropTypes } from 'react-shared';

const formProps = {
  formElementRef: CustomPropTypes.ref,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
};

const gqlProps = {
  updateApplication: PropTypes.func.isRequired,
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
}) {
  const formValues = {
    name: React.useRef(null),
    providerName: React.useRef(null),
    description: React.useRef(null),
  };

  const handleFormSubmit = async e => {
    e.preventDefault();

    const description = formValues.description.current.value;
    const providerName = formValues.providerName.current.value;
    if (
      description === application.description &&
      providerName === application.providerName
    ) {
      return;
    }

    try {
      await updateApplication(application.id, {
        providerName,
        description,
        healthCheckURL: application.healthCheckURL,
        integrationSystemID: application.integrationSystemID,
      });
      onCompleted(application.name, 'Application updated successfully');
    } catch (e) {
      console.warn(e);
      onError(`Error occurred while updating Application`, e.message || ``);
    }
  };

  return (
    <form onChange={onChange} ref={formElementRef} onSubmit={handleFormSubmit}>
      <FormLabel htmlFor="provider-name">Provider Name</FormLabel>
      <input
        className="fd-has-margin-bottom-small"
        type="text"
        id="provider-name"
        ref={formValues.providerName}
        defaultValue={application.providerName}
        placeholder="Provider name"
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
