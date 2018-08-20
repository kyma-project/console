import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';

import Button from '../Button';
import Separator from '../Separator';
import Icon from '../Icon';

import {
  ModalWrapper,
  ModalHeader,
  ModalAdditionalContent,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
} from './components';

class Modal extends React.Component {
  static MODAL_APP_REF = '';

  static propTypes = {
    title: PropTypes.any.isRequired,
    content: PropTypes.any.isRequired,
    footer: PropTypes.any,
    handleClose: PropTypes.any,
    additionalContent: PropTypes.any,
    modalOpeningComponent: PropTypes.any,
    warning: PropTypes.bool,
    borderFooter: PropTypes.bool,
    modalAppRef: PropTypes.string,
    width: PropTypes.string,
  };

  static defaultProps = {
    title: 'Modal',
    warning: false,
    borderFooter: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    ReactModal.setAppElement(
      this.props.modalAppRef ? this.props.modalAppRef : Modal.MODAL_APP_REF,
    );
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    const { handleClose } = this.props;
    if (handleClose) {
      if (typeof handleClose === 'function') {
        handleClose();
      } else if (Array.isArray(handleClose)) {
        for (const close of handleClose) {
          close();
        }
      }
    }
    this.setState({ showModal: false });
  };

  render() {
    const {
      title,
      content,
      footer,
      additionalContent,
      warning,
      borderFooter,
      modalOpeningComponent,
      width,
    } = this.props;
    const { showModal } = this.state;

    const reactModalCustomModalStyles = {
      content: {
        width: width ? width : '681px',
        maxHeight: '80vh',
        margin: 'auto',
        borderRadius: '4px',
        backgroundColor: '#ffffff',
        padding: '0px',
        position: 'relative',
        top: '50%',
        left: '0px',
        transform: 'translatey(-50%)',
        boxShadow:
          '0 20px 32px 0 rgba(0, 0, 0, 0.2), 0 0 2px 0 rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      },
    };

    if (warning) {
      reactModalCustomModalStyles.content.borderLeft = '6px solid #ee0000';
    } else {
      reactModalCustomModalStyles.content.borderLeft = '';
    }

    return (
      <ModalWrapper align="left">
        <div onClick={this.handleOpenModal}>{modalOpeningComponent}</div>
        {showModal ? (
          <ReactModal
            isOpen={showModal}
            onRequestClose={this.handleCloseModal}
            style={reactModalCustomModalStyles}
            shouldCloseOnOverlayClick={false}
          >
            <ModalHeader>
              {title}
              <ModalCloseButton onClick={this.handleCloseModal}>
                <Icon icon={'\ue03e'} />
              </ModalCloseButton>
            </ModalHeader>
            {additionalContent && (
              <ModalAdditionalContent>
                {additionalContent}
              </ModalAdditionalContent>
            )}
            <ModalContent>{content}</ModalContent>
            {footer && (
              <ModalFooter borderFooter={borderFooter}>{footer}</ModalFooter>
            )}
          </ReactModal>
        ) : null}
      </ModalWrapper>
    );
  }
}

export default Modal;
