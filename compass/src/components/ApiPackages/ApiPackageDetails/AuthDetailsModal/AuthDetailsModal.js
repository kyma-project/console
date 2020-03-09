import React from 'react';
import PropTypes from 'prop-types';

import JSONEditor from 'components/Shared/JSONEditor';
import { FormLabel } from 'fundamental-react';
import { Modal } from 'react-shared';

AuthDetailsModal.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default function AuthDetailsModal({ auth }) {
  return (
    <Modal
      title="Auth Details"
      modalOpeningComponent={
        <span className="link" style={{ display: 'block', textAlign: 'right' }}>
          Details
        </span>
      }
      confirmText="Ok"
    >
      <FormLabel>Context</FormLabel>
      <JSONEditor readonly={true} text={auth.context || '{}'} />
      <FormLabel className="fd-has-margin-top-medium">
        Input parameters
      </FormLabel>
      <JSONEditor readonly={true} text={auth.inputParams || '{}'} />
    </Modal>
  );
}
