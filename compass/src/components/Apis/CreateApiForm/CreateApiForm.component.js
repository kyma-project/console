import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';

CreateApiForm.propTypes = {
  applicationId: PropTypes.string.isRequired,
  addAPI: PropTypes.func.isRequired,
  formElementRef: CustomPropTypes.ref,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
};

export default function CreateApiForm({
  applicationId,
  addAPI,
  formElementRef,
  onChange,
  onCompleted,
  onError,
}) {
  const handleFormSubmit = async e => {
    e.preventDefault();
    onCompleted('TODO', `Runtime created succesfully`);
  };

  return (
    <form
      onChange={onChange}
      ref={formElementRef}
      style={{ width: '30em' }}
      onSubmit={handleFormSubmit}
    ></form>
  );
}
