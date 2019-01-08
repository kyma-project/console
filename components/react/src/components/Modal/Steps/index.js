import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../Button';
import Modal from '../index';
import Spinner from '../../Spinner';
import Tooltip from '../../Tooltip';

import StepsView from './StepsView';

class StepsModal extends React.Component {
  static propTypes = {
    title: PropTypes.any.isRequired,
    content: PropTypes.arrayOf(PropTypes.any).isRequired,
    contentTexts: PropTypes.arrayOf(PropTypes.string).isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    handleConfirmation: PropTypes.func.isRequired,
    modalOpeningComponent: PropTypes.any,
    disabledNext: PropTypes.bool,
    waiting: PropTypes.bool,
    tooltipData: PropTypes.object,
    width: PropTypes.string,
    handleClose: PropTypes.any,
    modalAppRef: PropTypes.string,
  };

  static defaultProps = {
    title: 'Modal',
    confirmText: 'Accept',
    cancelText: 'Cancel',
    contentTexts: ['First', 'Second'],
    disabledNext: false,
  };

  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      currentStage: 1,
    };
  };

  clearState = () => {
    this.setState(this.getInitialState());
  };

  handleNext = () => {
    const { currentStage } = this.state;
    if (currentStage < this.props.content.length) {
      this.setState({ currentStage: currentStage + 1 });
    }
  };

  handlePrevious = () => {
    const { currentStage } = this.state;
    if (currentStage > 1) {
      this.setState({ currentStage: currentStage - 1 });
    }
  };

  handleConfirmation = () => {
    try {
      const prevent = this.props.handleConfirmation();
      if (prevent) {
        this.clearState();
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
      contentTexts,
      confirmText,
      cancelText,
      modalOpeningComponent,
      disabledNext,
      waiting,
      tooltipData,
      width,
      handleClose,
      modalAppRef,
    } = this.props;
    const { currentStage } = this.state;

    const numberOfSteps = content.length;

    const nextButtonMessage = waiting ? (
      <div style={{ width: '97px', height: '16px' }}>
        <Spinner
          color={currentStage === numberOfSteps ? '#fff' : ''}
          padding="0 16px"
          size="14px"
        />
      </div>
    ) : currentStage === numberOfSteps ? (
      confirmText
    ) : (
      'Next'
    );

    const stepView = (
      <div>
        <StepsView
          currentStage={currentStage}
          firstText={
            currentStage === 1
              ? contentTexts[0]
              : contentTexts[currentStage - 2]
          }
          secondText={
            currentStage === numberOfSteps
              ? contentTexts[numberOfSteps - 1]
              : contentTexts[currentStage]
          }
          secondNumber={
            currentStage === numberOfSteps ? numberOfSteps : currentStage + 1
          }
        />
      </div>
    );

    const nextButton = (
      <Button
        marginTop="0"
        marginBottom="0"
        last
        normal
        style={{ position: 'relative', top: waiting ? '3px' : '0' }}
        primary={currentStage === numberOfSteps}
        secondary={currentStage !== numberOfSteps}
        onClick={
          currentStage === numberOfSteps
            ? this.handleConfirmation
            : this.handleNext
        }
        disabled={disabledNext}
        data-e2e-id={
          currentStage === numberOfSteps ? 'modal-create' : 'modal-next'
        }
      >
        {nextButtonMessage}
      </Button>
    );

    const footer = (
      <footer>
        <Button
          marginTop="0"
          marginBottom="0"
          last
          normal
          onClick={() => this.child.handleCloseModal()}
          data-e2e-id={'modal-cancel'}
        >
          {cancelText}
        </Button>
        {currentStage > 1 && (
          <Button
            marginTop="0"
            marginBottom="0"
            normal
            secondary
            onClick={this.handlePrevious}
            data-e2e-id={'modal-previous'}
          >
            Previous
          </Button>
        )}
        {tooltipData ? (
          <Tooltip
            {...tooltipData}
            minWidth={tooltipData.minWidth ? tooltipData.minWidth : '191px'}
          >
            {nextButton}
          </Tooltip>
        ) : (
          nextButton
        )}
      </footer>
    );

    return (
      <Modal
        ref={modal => {
          this.child = modal;
        }}
        title={title}
        content={content[currentStage - 1]}
        footer={footer}
        handleClose={[handleClose, this.clearState]}
        additionalContent={stepView}
        modalOpeningComponent={modalOpeningComponent}
        borderFooter={true}
        width={width}
        modalAppRef={modalAppRef}
      />
    );
  }
}

export default StepsModal;
