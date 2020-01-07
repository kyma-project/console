import React from 'react';
import PropTypes from 'prop-types';

import { Modal as FdModal } from 'fundamental-react';

ControlledModal.propTypes = {
  title: PropTypes.any,
  modalOpeningComponent: PropTypes.any.isRequired,
  actions: PropTypes.any.isRequired,
  show: PropTypes.bool.isRequired,
  type: PropTypes.string,
  children: PropTypes.any,
  modalClassName: PropTypes.string,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

ControlledModal.defaultProps = {
  title: 'Modal',
  actions: null,
  type: 'default',
};

export function ControlledModal({
  title,
  actions,
  modalOpeningComponent,
  show,
  type,
  children,
  modalClassName,
  onOpen,
  onClose,
}) {
  return (
    <>
      <div onClick={onOpen}>{modalOpeningComponent}</div>
      <FdModal
        modalClassName={modalClassName}
        type={type}
        title={title}
        show={show}
        actions={actions}
        onClose={onClose}
      >
        {children}
      </FdModal>
    </>
  );
}
