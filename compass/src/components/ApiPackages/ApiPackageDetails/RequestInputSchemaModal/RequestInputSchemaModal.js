import React from 'react';
import PropTypes from 'prop-types';

import JSONEditor from 'components/Shared/JSONEditor';
import { Modal } from 'react-shared';

RequestInputSchemaModal.propTypes = {
  schema: PropTypes.string.isRequired,
};

export default function RequestInputSchemaModal({ schema }) {
  return (
    <Modal
      title="Request input schema"
      modalOpeningComponent={<span className="link">Show</span>}
      confirmText=""
      cancelText="cancel"
    >
      <JSONEditor readonly={true} text={schema} />
    </Modal>
  );
}
