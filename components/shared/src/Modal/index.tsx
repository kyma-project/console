import React, { useState } from 'react';
import { Button } from 'fundamental-react';
import { luigiClient } from '@kyma-project/common';

import { Spinner } from '../Spinner';
import { Tooltip, TooltipProps } from '../Tooltip/Tooltip';

import { FdModal, ModalWrapper } from './styled';

type ButtonTypes = 'standard' | 'positive' | 'negative' | 'medium' | undefined;

function extractButtonType(modalType: ModalType): ButtonTypes {
  switch (modalType) {
    case ModalType.POSITIVE: {
      return 'positive';
    }
    case ModalType.WARNING: {
      return 'medium';
    }
    case ModalType.NEGATIVE: {
      return 'negative';
    }
    default: {
      return;
    }
  }
}

export enum ModalType {
  STANDARD = '',
  INFO = 'info',
  POSITIVE = 'positive',
  WARNING = 'warning',
  NEGATIVE = 'negative',
}

export interface ModalProps {
  title: React.ReactNode;
  confirmText?: React.ReactNode;
  closeText?: React.ReactNode;
  openingComponent: React.ReactNode;
  type?: ModalType;
  onOpen?: () => void;
  onClose?: () => void;
  onConfirm?: () => void;
  actions?: React.ReactNode;
  tooltipData?: TooltipProps;
  disabledConfirm?: boolean;
  waiting?: boolean;
  width?: string;
}

export const Modal: React.FunctionComponent<ModalProps> = ({
  title,
  confirmText = 'Confirm',
  closeText = 'Cancel',
  openingComponent,
  type = ModalType.STANDARD,
  onOpen,
  onClose,
  onConfirm,
  actions: ac,
  disabledConfirm = false,
  waiting = false,
  tooltipData,
  width,
  children,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const openModal = () => {
    onOpen && onOpen();
    setShowModal(true);

    try {
      luigiClient.uxManager().addBackdrop();
    } catch {}
  };

  const closeModal = () => {
    onClose && onClose();
    setShowModal(false);

    try {
      luigiClient.uxManager().removeBackdrop();
    } catch {}
  };

  const confirm = () => {
    onConfirm && onConfirm();
    closeModal();
  };

  const actionsFactory = (): React.ReactNode => {
    const confirmMessage = waiting ? (
      <div style={{ width: '97px', height: '16px' }}>
        <Spinner />
      </div>
    ) : (
      confirmText
    );

    let confirmButton = (
      <Button
        type={extractButtonType(type)}
        option={onConfirm && 'emphasized'}
        onClick={confirm}
        disabled={disabledConfirm}
        data-e2e-id="modal-confirmation-button"
      >
        {confirmMessage}
      </Button>
    );
    confirmButton = tooltipData ? (
      <Tooltip
        {...tooltipData}
        minWidth={tooltipData.minWidth ? tooltipData.minWidth : '191px'}
      >
        {confirmButton}
      </Tooltip>
    ) : (
      confirmButton
    );

    return (
      <>
        <Button
          style={{ marginRight: '12px' }}
          option="light"
          onClick={closeModal}
        >
          {closeText}
        </Button>
        {confirmButton}
      </>
    );
  };

  return (
    <>
      <ModalWrapper onClick={openModal}>{openingComponent}</ModalWrapper>
      <FdModal
        width={width}
        type={type}
        title={title}
        show={showModal}
        onClose={closeModal}
        actions={ac || actionsFactory()}
      >
        {children}
      </FdModal>
    </>
  );
};
