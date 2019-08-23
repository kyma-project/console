import React from 'react';
import PropTypes, { func } from 'prop-types';
import { ActionBar } from 'fundamental-react';
import LuigiClient from '@kyma-project/luigi-client';
import { Breadcrumb, BreadcrumbItem, Button } from '@kyma-project/react-components';

import '../../../../shared/styles/header.scss';

function navigateToApplication() {
  LuigiClient.linkManager()
    .fromContext('application')
    .navigate('');
}

function navigateToApplications() {
  LuigiClient.linkManager()
    .fromContext('tenant')
    .navigate('/applications');
}

class ApiDetailsHeader extends React.Component {

  PropTypes = {
    api: PropTypes.object.isRequired,
    application: PropTypes.object.isRequired,
    deleteApi: PropTypes.func.isRequired
  };

  delete = async element => {
    try {
      await this.props.deleteApi(element.id);
      this.navigateToApplication();
    } catch (e) {
      LuigiClient.uxManager().showAlert({
        text: `Error occored during deletion ${e.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  handleDelete = api => {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: 'Remove api',
        body: `Are you sure you want to delete api "${api.name}"?`,
        buttonConfirm: 'Delete',
        buttonDismiss: 'Cancel',
      })
      .then(() => {
        this.delete(api);
      })
      .catch(() => {});
  };

  render() {
    return (
      <header className="fd-has-background-color-background-2">
        <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
          <section>
            <Breadcrumb>
              <BreadcrumbItem
                name="Applications"
                url="#"
                onClick={navigateToApplications}
              />
              <BreadcrumbItem
                name={this.props.application.name}
                url="#"
                onClick={navigateToApplication}
              />
              <BreadcrumbItem />
            </Breadcrumb>
            <ActionBar.Header title={this.props.api.name} />
          </section>
          <ActionBar.Actions>
            <Button
              onClick={() => this.handleDelete(this.props.api)}
              option="light"
              type="negative"
            >
              Delete
            </Button>
          </ActionBar.Actions>
        </section>
      </header>
    );
  }
}

export default ApiDetailsHeader;
