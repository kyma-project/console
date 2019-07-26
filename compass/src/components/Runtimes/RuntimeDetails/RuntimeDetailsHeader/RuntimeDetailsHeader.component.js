import React from 'react';
import PropTypes from 'prop-types';
import { ActionBar } from 'fundamental-react/lib/ActionBar';
import {
  Button,
  Breadcrumb,
  Panel,
  PanelGrid,
} from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';

import StatusBadge from '../../../Shared/StatusBadge/StatusBadge';
import '../../../../shared/styles/header.scss';

class RuntimeDetailsHeader extends React.Component {
  PropTypes = {
    runtime: PropTypes.object.isRequired,
    deleteRuntime: PropTypes.func.isRequired,
  };

  handleDelete = runtime => {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: 'Remove runtime',
        body: `Are you sure you want to delete runtime "${runtime.name}"?`,
        buttonConfirm: 'Delete',
        buttonDismiss: 'Cancel',
      })
      .then(() => {
        this.deleteEntry(runtime);
      })
      .catch(() => {});
  };

  deleteEntry = async element => {
    try {
      await this.props.deleteRuntime(element.id);
      LuigiClient.linkManager()
        .fromClosestContext()
        .navigate(`/runtimes`);
    } catch (e) {
      LuigiClient.uxManager().showAlert({
        text: `Error occored during deletion ${e.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  navigateToRuntimesList = () => {
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(`/runtimes`);
  };

  render = () => {
    const { name, description, id, status } = this.props.runtime;

    const PanelEntry = props => {
      return (
        <Panel>
          <Panel.Body>
            <p className="fd-has-color-text-4 fd-has-margin-bottom-none">
              {props.title}
            </p>
            {props.content}
          </Panel.Body>
        </Panel>
      );
    };

    return (
      <>
        <header className="fd-has-background-color-background-2">
          <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
            <section>
              <Breadcrumb>
                <Breadcrumb.Item
                  name="Runtimes"
                  url="#"
                  onClick={this.navigateToRuntimesList}
                />
                <Breadcrumb.Item />
              </Breadcrumb>
              <ActionBar.Header title={name} />
            </section>
            <ActionBar.Actions>
              <Button
                onClick={() => this.handleDelete(this.props.runtime)}
                type="negative"
                option="light"
              >
                Delete
              </Button>
            </ActionBar.Actions>
          </section>
          <PanelGrid nogap cols={3}>
            {status && (
              <PanelEntry
                title="Status"
                content={<StatusBadge status={status.condition} />}
              />
            )}
            <PanelEntry
              title="Description"
              content={description ? description : '-'}
            />
            <PanelEntry title="ID" content={id} />
          </PanelGrid>
        </header>
      </>
    );
  };
}

export default RuntimeDetailsHeader;
