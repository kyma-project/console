import React from 'react';
import Grid from 'styled-components-grid';
import {
  HeaderWrapper,
  HeaderTitle,
  HeaderButton,
  HeaderColumnsWrapper,
  HeaderColumnsName,
} from '../shared/component-styles';
import { Tooltip } from '@kyma-project/react-components';
import InstanceModalContainer from "../Modal/InstancesModal.container"

class BindingHeader extends React.Component {
  state = {
    open: false,
  };

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  handleSuccess = () => {
    setTimeout(() => {
      if (typeof this.props.refetch === 'function') {
        this.props.refetch();
      }
    }, 500);
  };

  createBindingButton = () => {
    return this.props.data.serviceInstance.status.type === 'RUNNING' ? (
      <HeaderButton onClick={this.openModal}>+ Create Binding</HeaderButton>
    ) : (
      <Tooltip content="Instance must be in a Running state" minWidth="130px">
        <HeaderButton disabled={true}>+ Create Binding</HeaderButton>
      </Tooltip>
    );
  };

  render() {
    return (
      <HeaderWrapper>
        <Grid>
          <Grid.Unit size={0.75}>
            <HeaderTitle>Bindings</HeaderTitle>
          </Grid.Unit>
          <Grid.Unit size={0.25} style={{ textAlign: 'right' }}>
            {this.createBindingButton()}
          </Grid.Unit>
        </Grid>
        <HeaderColumnsWrapper>
          <Grid>
            <Grid.Unit size={0.25}>
              <HeaderColumnsName>Binding Usage</HeaderColumnsName>
            </Grid.Unit>
            <Grid.Unit size={0.25}>
              <HeaderColumnsName>Bound Resource</HeaderColumnsName>
            </Grid.Unit>
            <Grid.Unit size={0.2}>
              <HeaderColumnsName>Binding</HeaderColumnsName>
            </Grid.Unit>
            <Grid.Unit size={0.2}>
              <HeaderColumnsName>Secret</HeaderColumnsName>
            </Grid.Unit>
          </Grid>
        </HeaderColumnsWrapper>
        <InstanceModalContainer
          open={this.state.open}
          data={this.props.data}
          createBindingUsage={this.props.createBindingUsage}
          createBinding={this.props.createBinding}
          closeModal={this.closeModal}
          handleSuccess={this.handleSuccess}
        />
      </HeaderWrapper>
    );
  }
}

export default BindingHeader;
