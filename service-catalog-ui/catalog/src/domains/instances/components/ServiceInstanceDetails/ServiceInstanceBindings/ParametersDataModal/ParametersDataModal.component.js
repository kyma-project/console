import React from 'react';

import LuigiClient from '@kyma-project/luigi-client';
import { Modal, Button } from '@kyma-project/react-components';

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
      onShow={() => LuigiClient.uxManager().addBackdrop()}
      onHide={() => LuigiClient.uxManager().removeBackdrop()}
    >
      <JSONCode data-e2e-id="parameters-content">
        {JSON.stringify(data, undefined, 2)}
      </JSONCode>
    </Modal>
  );
};

export default ParametersDataModal;
