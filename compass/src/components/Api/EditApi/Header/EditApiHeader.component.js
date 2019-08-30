import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { ActionBar } from 'fundamental-react';
import {
  Button,
  Breadcrumb,
  Panel,
  PanelGrid,
} from '@kyma-project/react-components';

EditApiHeader.propTypes = {
  apiData: PropTypes.object.isRequired,
  applicationName: PropTypes.string.isRequired,
  saveChanges: PropTypes.func.isRequired,
  canSaveChanges: PropTypes.bool.isRequired,

  deleteApi: PropTypes.func.isRequired,
  deleteEventApi: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default function EditApiHeader({
  apiData,
  applicationName,
  saveChanges,
  canSaveChanges,

  deleteApi,
  deleteEventApi,
  sendNotification,
}) {
  function navigateBackToApplication() {
    LuigiClient.linkManager()
      .fromContext('application')
      .navigate('');
  }

  function navigateToApplications() {
    LuigiClient.linkManager()
      .fromContext('tenant')
      .navigate('/applications');
  }

  function handleDelete() {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: `Delete ${apiData.generalInformation.name}`,
        body: `Are you sure you want to delete "${apiData.generalInformation.name}"?`,
        buttonConfirm: 'Delete',
        buttonDismiss: 'Cancel',
      })
      .then(() => {
        deleteEntry();
      })
      .catch(() => {});
  }

  async function deleteEntry() {
    const id = apiData.id;
    const name = apiData.generalInformation.name;

    try {
      if (apiData.apiType === 'API') {
        await deleteApi(id);
      } else {
        await deleteEventApi(id);
      }
      sendNotification({
        variables: {
          content: `"${name}" deleted from application.`,
          title: `${name}`,
          color: '#359c46',
          icon: 'accept',
          instanceName: name,
        },
      });
      LuigiClient.uxManager().setDirtyStatus(false);
      navigateBackToApplication();
    } catch (error) {
      console.warn(error);
      LuigiClient.uxManager().showAlert({
        text: error.message,
        type: 'error',
        closeAfter: 10000,
      });
    }
  }

  function formatSpecType() {
    switch (apiData.spec.type) {
      case 'ASYNC_API':
        return 'Event API';
      case 'OPEN_API':
        return 'OpenAPI';
      case 'ODATA':
        return 'OData';
      default:
        return '';
    }
  }

  return (
    <header className="fd-has-background-color-background-2">
      <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
        <section>
          <Breadcrumb>
            <Breadcrumb.Item
              name="Applications"
              url="#"
              onClick={navigateToApplications}
            />
            <Breadcrumb.Item
              name={applicationName}
              url="#"
              onClick={navigateBackToApplication}
            />
            <Breadcrumb.Item />
          </Breadcrumb>
          <ActionBar.Header title={`Edit ${apiData.generalInformation.name}`} />
        </section>
        <ActionBar.Actions>
          <Button
            onClick={saveChanges}
            disabled={!canSaveChanges}
            option="emphasized"
          >
            Save
          </Button>
          <Button onClick={handleDelete} option="light" type="negative">
            Delete
          </Button>
        </ActionBar.Actions>
      </section>
      <PanelGrid nogap cols={4}>
        <Panel>
          <Panel.Body>
            <p className="fd-has-color-text-4 fd-has-margin-bottom-none">
              Type
            </p>
            {formatSpecType()}
          </Panel.Body>
        </Panel>
      </PanelGrid>
    </header>
  );
}
