import React from 'react';
import { Modal, ModalType } from '@kyma-project/components';
import { Button } from 'fundamental-react';

import { MODAL, FORMS, CONFIGURATION_VARIABLE } from '../../../constants';

interface Props {
  configurationName: string;
  url: string;
  handleDelete: () => void;
}

const DeleteUrlModalComponent: React.FunctionComponent<Props> = ({
  configurationName,
  url,
  handleDelete,
}) => {
  const openingComponentModal = (
    <Button glyph="decline" option="light" compact={true} />
  );

  return (
    <Modal
      title={MODAL.DELETE_MODAL_TITLE}
      confirmText={MODAL.DELETE_TEXT}
      onConfirm={handleDelete}
      openingComponent={openingComponentModal}
      type={ModalType.NEGATIVE}
    >
      {FORMS.DELETE_URL_CONFIRM_TEXT.replace(
        CONFIGURATION_VARIABLE,
        configurationName,
      )}
    </Modal>
  );
};

export default DeleteUrlModalComponent;
