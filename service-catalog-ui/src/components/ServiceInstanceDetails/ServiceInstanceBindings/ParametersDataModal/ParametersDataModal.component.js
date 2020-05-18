import React from 'react';

import { Button } from 'fundamental-react';
import { Modal } from 'react-shared';

import { JSONCode } from './styled';

const ParametersDataModal = ({ title, data }) => {
  return (
    <Modal
      title={title}
      modalOpeningComponent={
        <Button
          data-e2e-id="parameters-button"
          compact
          option="light"
          glyph="syntax"
        />
      }
      confirmText="Close"
    >
      <JSONCode data-e2e-id="parameters-content">
        {JSON.stringify(data, undefined, 2)}
      </JSONCode>
    </Modal>
  );
};

export default ParametersDataModal;
