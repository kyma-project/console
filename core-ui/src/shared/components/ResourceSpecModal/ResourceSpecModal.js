import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'fundamental-react';
import { Modal, JSONEditor } from 'react-shared';

ResourceSpecModal.propTypes = {
  spec: PropTypes.string.isRequired,
  resourceName: PropTypes.string,
  updateResource: PropTypes.func.isRequired, // return "false" to prevent closing the modal
};

export default function ResourceSpecModal({
  spec: originalSpec,
  name = 'resource',
  updateResource,
}) {
  const format = text => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch (_) {
      return text;
    }
  };

  const [spec, setSpec] = React.useState('');

  const isValid = text => {
    try {
      JSON.parse(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <Modal
      title={`Update ${name}`}
      modalOpeningComponent={<Button option="emphasized">Edit</Button>}
      confirmText="Apply"
      cancelText="Cancel"
      onChangeText={setSpec}
      onShow={() => setSpec(originalSpec)}
      onConfirm={() => updateResource(spec)}
      disabledConfirm={!isValid(spec)}
    >
      <div style={{ height: '50vh' }}>
        <JSONEditor text={format(spec)} onChangeText={setSpec} />
      </div>
    </Modal>
  );
}
