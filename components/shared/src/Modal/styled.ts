import styled from 'styled-components';
import { Modal } from 'fundamental-react';

import { ModalType } from './index';

export const ModalWrapper = styled.div`
  display: inline-block;
`;

interface FdModalProps {
  type?: ModalType;
  minWidth?: string;
  width?: string;
  maxWidth?: string;
}

function modalBorder(type?: ModalType): string {
  if (!type) {
    return '';
  }

  const border = (color: string) => `6px solid ${color}`;
  switch (type) {
    case ModalType.INFO: {
      return border('#ee0000');
    }
    case ModalType.POSITIVE: {
      return border('#ee0000');
    }
    case ModalType.WARNING: {
      return border('#ee0000');
    }
    case ModalType.NEGATIVE: {
      return border('#ee0000');
    }
    default: {
      return '';
    }
  }
}

export const FdModal = styled(Modal)<FdModalProps>`
  && {
    .fd-modal {
      max-width: unset;
    }

    .fd-modal__content {
      min-width: ${props => props.minWidth || '320px'};
      width: ${props => props.width || 'unset'};
      max-width: ${props => props.maxWidth || 'unset'};
      border-left: ${props => modalBorder(props.type)};
    }

    .fd-modal__footer {
      border-top: none;
    }
  }
`;
