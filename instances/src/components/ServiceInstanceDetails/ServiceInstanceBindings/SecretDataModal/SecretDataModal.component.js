import React, { Fragment } from 'react';
import Grid from 'styled-components-grid';
import LuigiClient from '@kyma-project/luigi-client';
import { Button, Modal } from '@kyma-project/react-components';
import { List, Item, Bold, Text } from './styled';

class SecretDataModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      encoded: true,
    };
  }

  toggleEncoded = () => {
    this.setState({
      encoded: !this.state.encoded,
    });
  };

  populateItems = (data, encoded) => {
    return Object.entries(data).map(([key, value]) => (
      <Grid key={key}>
        <Grid.Unit size={0.25}>
          <Item>
            <Bold>{key}</Bold>
          </Item>
        </Grid.Unit>
        <Grid.Unit size={0.75}>
          <Item data-e2e-id={`secret-${encoded ? 'encoded' : 'decoded'}`}>
            {encoded ? this.randomizeAsterisks(data[key]) : value}
          </Item>
        </Grid.Unit>
      </Grid>
    ));
  };

  randomizeAsterisks = value => {
    return '*'.repeat(Math.ceil(value.length / 10) * 4);
  };

  render() {
    const { title, data, prefix, modalOpeningComponent } = this.props;
    const { encoded } = this.state;

    const items = this.populateItems(data, encoded);
    const content = (
      <Fragment>
        {prefix && (
          <Text>
            All variables will be prefixed with:{' '}
            <Bold data-e2e-id="secret-prefix">'{prefix}'</Bold>.
          </Text>
        )}
        <List>{items}</List>
      </Fragment>
    );
    const actions = (
      <Button
        data-e2e-id={`button-${encoded ? 'decode' : 'encode'}`}
        onClick={this.toggleEncoded}
      >
        {encoded ? 'Decode' : 'Encode'}
      </Button>
    );

    return (
      <Modal
        width={'681px'}
        title={title}
        modalOpeningComponent={modalOpeningComponent}
        onShow={() => LuigiClient.uxManager().addBackdrop()}
        onHide={() => LuigiClient.uxManager().removeBackdrop()}
        actions={actions}
      >
        {content}
      </Modal>
    );
  }
}

export default SecretDataModal;
