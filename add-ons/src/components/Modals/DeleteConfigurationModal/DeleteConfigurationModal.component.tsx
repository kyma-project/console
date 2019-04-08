import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { Modal, Button } from '@kyma-project/react-components';

interface Props {
  configurationName: string;
  handleDelete: () => void;
}

export const DeleteConfigurationModal: React.FunctionComponent<Props> = ({
  configurationName,
  handleDelete,
}) => {
  const openingComponentModal = (
    <Button glyph="delete" option="light" type="negative" compact />
  );

  return (
    <Modal
      title="Delete"
      confirmText="Delete"
      onConfirm={handleDelete}
      modalOpeningComponent={openingComponentModal}
      type="negative"
      onShow={() => LuigiClient.uxManager().addBackdrop()}
      onHide={() => LuigiClient.uxManager().removeBackdrop()}
    >
      {`Are you sure you want to delete configuration "${configurationName}"?`}
    </Modal>
  );
};

export default DeleteConfigurationModal;
