import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../Button';
import Modal from '../index';

class ConfirmationModal extends React.Component {
  static propTypes = {
    title: PropTypes.any.isRequired,
    content: PropTypes.any.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    handleConfirmation: PropTypes.func.isRequired,
    modalOpeningComponent: PropTypes.any,
    warning: PropTypes.bool,
    disabled: PropTypes.bool,
    width: PropTypes.string,
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
      this.props.handleConfirmation();
      this.child.handleCloseModal();
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
      warning,
      disabled,
      width,
    } = this.props;

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
          data-e2e-id={`instance-cancel-${this.props.entryName}`}
        >
          {confirmText}
        </Button>
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
      />
    );
  }
}

export default ConfirmationModal;
