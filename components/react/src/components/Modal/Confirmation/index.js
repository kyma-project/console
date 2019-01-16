import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../Button';
import Tooltip from '../../Tooltip';
import Spinner from '../../Spinner';
import Modal from '../index';

class ConfirmationModal extends React.Component {
  static propTypes = {
    title: PropTypes.any.isRequired,
    content: PropTypes.any.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    handleConfirmation: PropTypes.func.isRequired,
    modalOpeningComponent: PropTypes.any,
    tooltipData: PropTypes.object,
    warning: PropTypes.bool,
    waiting: PropTypes.bool,
    disabled: PropTypes.bool,
    width: PropTypes.string,
    borderFooter: PropTypes.bool,
    handleClose: PropTypes.any,
    headerAdditionalInfo: PropTypes.string,
    modalAppRef: PropTypes.string,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
  };

  static defaultProps = {
    title: 'Modal',
    confirmText: 'Accept',
    cancelText: 'Cancel',
  };

  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  handleConfirmation = () => {
    try {
      const prevent = this.props.handleConfirmation();
      if (prevent) {
        this.child.handleCloseModal();
      }
    } catch (err) {
      console.log(err);
      this.child.handleCloseModal();
    }
  };

  render() {
    const {
      title,
      content,
      confirmText,
      cancelText,
      modalOpeningComponent,
      tooltipData,
      warning,
      waiting,
      disabled,
      width,
      borderFooter,
      handleClose,
      headerAdditionalInfo,
      modalAppRef,
      onShow,
      onHide,
    } = this.props;

    const confirmMessage = waiting ? (
      <div style={{ width: '97px', height: '16px' }}>
        <Spinner color="#fff" padding="0 16px" size="14px" />
      </div>
    ) : (
      confirmText
    );

    const confirmButton = (
      <Button
        normal
        marginTop="0"
        marginBottom="0"
        last
        primary={!warning}
        secondary={warning}
        remove={warning}
        onClick={this.handleConfirmation}
        disabled={disabled}
        style={{ position: 'relative', top: waiting ? '3px' : '0' }}
        data-e2e-id={'modal-create'}
      >
        {confirmMessage}
      </Button>
    );

    const footer = (
      <footer>
        <Button
          normal
          marginTop="0"
          marginBottom="0"
          first
          onClick={() => this.child.handleCloseModal()}
          data-e2e-id={`instance-delete-${this.props.entryName}`}
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
      </footer>
    );

    return (
      <Modal
        ref={modal => {
          this.child = modal;
        }}
        title={title}
        content={content}
        footer={footer}
        modalOpeningComponent={modalOpeningComponent}
        warning={warning}
        width={width}
        borderFooter={borderFooter}
        handleClose={handleClose}
        headerAdditionalInfo={headerAdditionalInfo}
        modalAppRef={modalAppRef}
        onShow={onShow}
        onHide={onHide}
      />
    );
  }
}

export default ConfirmationModal;
