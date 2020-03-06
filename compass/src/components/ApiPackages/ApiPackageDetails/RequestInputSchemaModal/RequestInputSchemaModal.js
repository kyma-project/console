import React from 'react';
import PropTypes from 'prop-types';

import JSONEditor from 'components/Shared/JSONEditor';
import { Modal } from 'react-shared';

RequestInputSchemaModal.propTypes = {
  schema: PropTypes.string,
};

export default function RequestInputSchemaModal({ schema }) {
  return (
    <Modal
      title="Request input schema"
      modalOpeningComponent={<span className="link">Show</span>}
      confirmText="Ok"
    >
      <JSONEditor readonly={true} text={schema || '{}'} />
    </Modal>
  );
}
