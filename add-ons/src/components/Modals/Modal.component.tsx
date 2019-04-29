import React, { useState } from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { Button, Modal } from 'fundamental-react';

import {
  ModalWrapper,
  ActionsWrapper,
  OpeningComponentWrapper,
} from './styled';

interface ModalProps {
  title: string;
  confirmText?: string;
  closeText?: string;
  openingComponent: React.ReactNode;
  type?: 'info' | 'warning';
  onSubmit?: (event?: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onSubmitDisabled?: boolean;
}

export const ModalComponent: React.FunctionComponent<ModalProps> = ({
  title,
  confirmText,
  closeText,
  openingComponent,
  type = 'info',
  onSubmit,
  onOpen,
  onClose,
  onSubmitDisabled = false,
  children,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const setTrueShowModal = () => {
    onOpen && onOpen();
    setShowModal(true);
    LuigiClient.uxManager().addBackdrop();
  };

  const setFalseShowModal = () => {
    onClose && onClose();
    setShowModal(false);
    LuigiClient.uxManager().removeBackdrop();
  };

  const actions = (
    <ActionsWrapper>
      <Button onClick={setFalseShowModal} option="light">
        {closeText ? closeText : 'Cancel'}
      </Button>
      <Button
        onClick={() => {
          onSubmit && onSubmit();
          setFalseShowModal();
        }}
        option="emphasized"
        disabled={Boolean(onSubmitDisabled)}
      >
        {confirmText ? confirmText : 'Create'}
      </Button>
    </ActionsWrapper>
  );

  return (
    <ModalWrapper>
      <OpeningComponentWrapper onClick={setTrueShowModal}>
        {openingComponent}
      </OpeningComponentWrapper>
      <Modal
        show={showModal}
        onClose={setFalseShowModal}
        title={title}
        actions={actions}
      >
        {children}
      </Modal>
    </ModalWrapper>
  );
};

export default ModalComponent;
