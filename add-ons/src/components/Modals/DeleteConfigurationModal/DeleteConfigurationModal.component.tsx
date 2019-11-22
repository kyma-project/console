import React from 'react';
import { Button } from 'fundamental-react';
import { Modal, ModalType } from '@kyma-project/components';

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
    <Button glyph="delete" option="light" compact={true} />
  );

  return (
    <Modal
      title={MODAL.DELETE_MODAL_TITLE}
      confirmText={MODAL.DELETE_TEXT}
      onConfirm={handleDelete}
      openingComponent={openingComponentModal}
      type={ModalType.NEGATIVE}
    >
      {FORMS.DELETE_CONFIGURATION_CONFIRM_TEXT.replace(
        CONFIGURATION_VARIABLE,
        configurationName,
      )}
    </Modal>
  );
};

export default DeleteConfigurationModalComponent;
