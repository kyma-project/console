import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { Modal, Button } from '@kyma-project/react-components';

interface Props {
  configurationName: string;
  url: string;
  handleDelete: () => void;
}

export const DeleteUrlModal: React.FunctionComponent<Props> = ({
  configurationName,
  url,
  handleDelete,
}) => {
  const openingComponentModal = (
    <Button glyph="decline" option="light" type="negative" compact />
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
      {`Are you sure you want to delete url of configuration "${configurationName}"?`}
    </Modal>
  );
};

export default DeleteUrlModal;
