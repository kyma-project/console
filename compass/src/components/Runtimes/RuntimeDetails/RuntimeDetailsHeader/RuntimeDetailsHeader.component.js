import React from 'react';

import { ActionBar } from 'fundamental-react/lib/ActionBar';
import { Badge } from 'fundamental-react/lib/Badge';

import LuigiClient from '@kyma-project/luigi-client';
import { Button, Breadcrumb } from '@kyma-project/react-components';

class RuntimeDetailsHeader extends React.Component {
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
  }

  render = () => {
    const { name, description, id, status } = this.props.runtime;
    return (
      <>
        <header className="fd-page__header fd-page__header--columns fd-has-background-color-background-2">
          <section className="fd-section">
            <div className="fd-action-bar">
              <div className="fd-action-bar__header">
                <Breadcrumb>
                  <Breadcrumb.Item
                    name="Runtimes"
                    url="#"
                    onClick={this.navigateToRuntimesList}
                  />
                  <Breadcrumb.Item />
                </Breadcrumb>
                <ActionBar.Header title={name} />
                <div className="fd-action-bar__description">
                  <div className="fd-container fd-container--fluid">
                    {status && (
                      <div className="fd-col--4">
                        Status
                        <span className="columns__value">
                          <Badge>{status.condition}</Badge>
                        </span>
                      </div>
                    )}
                    <div className="fd-col--4">
                      Description
                      <span className="columns__value">{description ? description : '-'}</span>
                    </div>
                    <div className="fd-col--4">
                      ID
                      <span className="columns__value">{id}</span>
                    </div>
                  </div>
                </div>
              </div>
              <ActionBar.Actions>
                <Button
                  onClick={() =>
                    this.handleDelete(this.props.runtime)
                  }
                  type="negative"
                  option="light"
                >
                  Delete
                </Button>
              </ActionBar.Actions>
            </div>
          </section>
        </header>
      </>
    );
  };
}

export default RuntimeDetailsHeader;
