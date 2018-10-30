import React, { Fragment } from 'react';

import {
  ConfirmationModal,
  Icon,
  Button,
  Separator,
} from '@kyma-project/react-components';

import { TextWrapper, Text } from './styled';

class DeleteBindingModal extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      bindingUsageChecked: props.deleteBindingUsage ? true : false,
      bindingChecked: props.deleteBinding && props.bindingExists,
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
      relatedBindingUsage,
      id,
    } = this.props;
    const { bindingChecked, bindingUsageChecked } = this.state;

    const submitEnabled = bindingChecked || bindingUsageChecked;

    const modalContent = (
      <Fragment>
        <div>
          {bindingUsageName && (
            <TextWrapper>
              <Text>Are you sure you want to delete "{bindingUsageName}".</Text>

              <Text warning>
                Removing Service Binding Usage will prevent your application
                from accessing the instance after its restart.
              </Text>
            </TextWrapper>
          )}

          {bindingExists && (
            <TextWrapper>
              <Text>Are you sure you want to delete "{bindingName}".</Text>

              <Text warning>
                Removing Service Binding will make all related applications stop
                working.
              </Text>

              {relatedBindingUsage &&
                relatedBindingUsage.length > 0 && (
                  <Fragment>
                    <Separator margin="20px -16px" />
                    {relatedBindingUsage.map((binding, index) => (
                      <TextWrapper flex key={`relatedBindingUsage${index}`}>
                        <Text bold width={'200px'} margin={'0 20px 20px 0'}>
                          {index === 0 && 'Related Binding Usages'}
                        </Text>
                        <Text>{binding.name}</Text>
                      </TextWrapper>
                    ))}
                  </Fragment>
                )}
            </TextWrapper>
          )}
        </div>
      </Fragment>
    );

    return (
      <ConfirmationModal
        ref={modal => (this.child = modal)}
        title={'Warning'}
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
