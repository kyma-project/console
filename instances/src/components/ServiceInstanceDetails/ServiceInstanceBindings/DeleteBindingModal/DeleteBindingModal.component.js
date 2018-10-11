import React, { Fragment } from 'react';

import {
  ConfirmationModal,
  Icon,
  Button,
} from '@kyma-project/react-components';

import {
  CheckboxWrapper,
  CheckboxInput,
  WarningText,
  IconWrapper,
} from './styled';

class DeleteBindingModal extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      bindingUsageChecked: props.deleteBindingUsage ? true : false,
      bindingChecked:
        props.deleteBinding &&
        props.bindingExists &&
        props.bindingUsageCount === 1,
    };
  }

  handleDeletion = async (shouldDeleteBindingUsage, shouldDeleteBinding) => {
    const {
      bindingName,
      bindingExists,
      bindingUsageName,
      deleteBindingUsage,
      deleteBinding,
      serviceInstanceRefetch,
    } = this.props;

    if (shouldDeleteBindingUsage) {
      await deleteBindingUsage(bindingUsageName);
    }
    if (shouldDeleteBinding && bindingExists) {
      await deleteBinding(bindingName);
    }

    setTimeout(() => {
      if (typeof serviceInstanceRefetch === 'function') {
        serviceInstanceRefetch();
      }
    }, 1000);
  };

  handleConfirmation = () => {
    const { bindingUsageChecked, bindingChecked } = this.state;
    this.handleDeletion(bindingUsageChecked, bindingChecked);
    this.child.child.handleCloseModal();
  };

  toggleBinding = () => {
    this.setState({
      bindingChecked: !this.state.bindingChecked,
    });
  };

  toggleBindingUsage = () => {
    this.setState({
      bindingUsageChecked: !this.state.bindingUsageChecked,
    });
  };

  render() {
    const {
      bindingName,
      bindingExists,
      bindingUsageName,
      bindingUsageCount,
      id,
    } = this.props;
    const { bindingChecked, bindingUsageChecked } = this.state;

    const submitEnabled = bindingChecked || bindingUsageChecked;

    const modalContent = (
      <Fragment>
        <div>
          {bindingUsageName && (
            <CheckboxWrapper>
              <CheckboxInput
                type="checkbox"
                onChange={this.toggleBindingUsage}
                checked={bindingUsageChecked}
              />
              {`Service Binding Usage "${bindingUsageName}"`}
              <WarningText checked={bindingUsageChecked}>
                <IconWrapper>
                  <Icon icon={'\uE0B1'} />
                </IconWrapper>&nbsp;
                <strong>Warning:</strong>
                &nbsp;Removing Service Binding Usage will prevent your
                application from accessing the instance after its restart.
              </WarningText>
            </CheckboxWrapper>
          )}

          {bindingExists && (
            <CheckboxWrapper>
              <CheckboxInput
                type="checkbox"
                onChange={this.toggleBinding}
                checked={bindingChecked}
              />
              {`Service Binding "${bindingName}"`}
              <WarningText checked={bindingChecked}>
                <IconWrapper>
                  <Icon icon={'\uE0B1'} />
                </IconWrapper>&nbsp;
                <strong>Warning:</strong>
                &nbsp;
                {bindingUsageCount > 1 &&
                  `You have ${bindingUsageCount} Service Binding Usage resources pointing to this Service Binding. `}
                Removing Service Binding will make all related Service Binding
                Usages stop working.
              </WarningText>
            </CheckboxWrapper>
          )}
        </div>
      </Fragment>
    );

    return (
      <ConfirmationModal
        ref={modal => (this.child = modal)}
        title="Which resources would you like to delete?"
        confirmText="Delete"
        content={modalContent}
        handleConfirmation={this.handleConfirmation}
        modalOpeningComponent={
          <div style={{ textAlign: 'right' }}>
            <Button padding={'0'} marginTop={'0'} marginBottom={'0'} id={id}>
              <Icon icon={'\uE03D'} />
            </Button>
          </div>
        }
        warning={true}
        disabled={!submitEnabled}
      />
    );
  }
}

export default DeleteBindingModal;
