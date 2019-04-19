import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import { FdModal } from './styled';
import Spinner from '../Spinner';
import Tooltip from '../Tooltip';
class Modal extends Component {
  state = {
    show: false,
  };

  static propTypes = {
    title: PropTypes.any,
    modalOpeningComponent: PropTypes.any.isRequired,
    actions: PropTypes.any,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    onConfirm: PropTypes.func.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    type: PropTypes.string,
    disabledConfirm: PropTypes.bool,
    waiting: PropTypes.bool,
  };

  static defaultProps = {
    title: 'Modal',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    actions: null,
    type: 'default',
    disabledConfirm: false,
    waiting: false,
  };

  onOpen = () => {
    const { onShow } = this.props;
    if (onShow && typeof onShow === 'function') {
      onShow();
    }
    this.setState({ show: true });
  };

  onClose = () => {
    const { onHide } = this.props;
    if (onHide && typeof onHide === 'function') {
      onHide();
    }
    this.setState({ show: false });
  };

  onConfirmation = () => {
    const { onConfirm } = this.props;
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm();
    }
    this.onClose();
  };

  confirmActions = () => {
    const {
      confirmText,
      cancelText,
      type,
      disabledConfirm,
      waiting,
      tooltipData,
    } = this.props;

    const confirmMessage = waiting ? (
      <div style={{ width: '97px', height: '16px' }}>
        <Spinner />
      </div>
    ) : (
      confirmText
    );

    const confirmButton = (
      <Button
        type={type}
        onClick={this.onConfirmation}
        disabled={disabledConfirm}
        data-e2e-id="modal-confirmation-button"
      >
        {confirmMessage}
      </Button>
    );

    return (
      <Fragment>
        <Button
          style={{ marginRight: '12px' }}
          option="light"
          onClick={this.onClose}
        >
          {cancelText}
        </Button>

        {tooltipData ? (
          <Tooltip
            {...tooltipData}
            minWidth={tooltipData.minWidth ? tooltipData.minWidth : '191px'}
          >
            {confirmButton}
          </Tooltip>
        ) : (
          confirmButton
        )}
      </Fragment>
    );
  };

  render() {
    const {
      props: {
        children,
        title,
        modalOpeningComponent,
        actions,
        onConfirm,
        type,
        width,
      },
      state: { show },
    } = this;

    let ac = actions;
    if (!ac && onConfirm && typeof onConfirm === 'function') {
      ac = this.confirmActions();
    }

    return (
      <Fragment>
        <div style={{ display: 'inline-block' }} onClick={this.onOpen}>
          {modalOpeningComponent}
        </div>
        <FdModal
          width={width}
          type={type}
          title={title}
          show={show}
          onClose={this.onClose}
          actions={ac}
        >
          {children}
        </FdModal>
      </Fragment>
    );
  }
}

export default Modal;
