import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { Modal, Button } from '@kyma-project/react-components';

import { MODAL, FORMS, CONFIGURATION_VARIABLE } from '../../../constants';

interface Props {
  configurationName: string;
  handleDelete: () => void;
}

const DeleteConfigurationModalComponent: React.FunctionComponent<Props> = ({
  configurationName,
  handleDelete,
}) => {
  const openingComponentModal = (
    <Button glyph="delete" option="light" type="negative" compact />
  );

  return (
    <Modal
      title={MODAL.DELETE_MODAL_TITLE}
      confirmText={MODAL.DELETE_TEXT}
      onConfirm={handleDelete}
      modalOpeningComponent={openingComponentModal}
      type="negative"
      onShow={() => LuigiClient.uxManager().addBackdrop()}
      onHide={() => LuigiClient.uxManager().removeBackdrop()}
    >
      {FORMS.DELETE_CONFIGURATION_CONFIRM_TEXT.replace(CONFIGURATION_VARIABLE, configurationName)}
    </Modal>
  );
};

export default DeleteConfigurationModalComponent;
