import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import ScrollArea from 'react-scrollbar';

import Tooltip from '../Tooltip';
import Icon from '../Icon';

import {
  ModalWrapper,
  ModalOpeningComponent,
  ModalHeader,
  ModalAdditionalContent,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  ModalInfoButton,
  ModalHeaderTitle,
  ModalHeaderAdditionalInfo,
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
      heightContent: 0,
      heightAdditionalContent: 0,
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

  onScrollContent = value => {
    this.setState({ heightContent: value.realHeight });
  };

  onScrollAdditionalContent = value => {
    this.setState({ heightAdditionalContent: value.realHeight });
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
      headerAdditionalInfo,
    } = this.props;
    const { showModal, heightContent, heightAdditionalContent } = this.state;

    const reactModalCustomModalStyles = {
      content: {
        width: width ? width : '681px',
        maxHeight: '85vh',
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

    const scrollbarStyles = {
      borderRadius: '4px',
      width: '7px',
      backgroundColor: '#000',
    };

    if (warning) {
      reactModalCustomModalStyles.content.borderLeft = '6px solid #ee0000';
    } else {
      reactModalCustomModalStyles.content.borderLeft = '';
    }

    return (
      <ModalWrapper align="left">
        <ModalOpeningComponent onClick={this.handleOpenModal}>
          {modalOpeningComponent}
        </ModalOpeningComponent>
        {showModal ? (
          <ReactModal
            isOpen={showModal}
            onRequestClose={this.handleCloseModal}
            shouldCloseOnOverlayClick={false}
            style={reactModalCustomModalStyles}
          >
            <ModalHeader>
              <ModalHeaderTitle>{title}</ModalHeaderTitle>
              <ModalHeaderAdditionalInfo>
                {headerAdditionalInfo && (
                  <ModalInfoButton>
                    <Tooltip
                      content={headerAdditionalInfo}
                      orientation={'bottom'}
                      minWidth={'300px'}
                      type="light"
                    >
                      <Icon icon={'\ue1c4'} />
                    </Tooltip>
                  </ModalInfoButton>
                )}
              </ModalHeaderAdditionalInfo>
              <ModalCloseButton onClick={this.handleCloseModal}>
                <Icon icon={'\ue03e'} />
              </ModalCloseButton>
            </ModalHeader>
            {additionalContent && (
              <ScrollArea
                onScroll={this.onScrollAdditionalContent}
                verticalScrollbarStyle={scrollbarStyles}
                style={{
                  height: heightAdditionalContent
                    ? heightAdditionalContent
                    : 'auto',
                }}
              >
                <ModalAdditionalContent>
                  {additionalContent}
                </ModalAdditionalContent>
              </ScrollArea>
            )}
            <ScrollArea
              onScroll={this.onScrollContent}
              verticalScrollbarStyle={scrollbarStyles}
              style={{
                height: heightContent ? heightContent : 'auto',
              }}
            >
              <ModalContent>{content}</ModalContent>
            </ScrollArea>
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
