import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { PanelGrid } from '@kyma-project/react-components';
import { ActionBar, Button, Breadcrumb } from 'fundamental-react';
import PanelEntry from 'shared/components/PanelEntry/PanelEntry.component';

import { handleDelete } from 'react-shared';
import { getApiDisplayName } from './../ApiHelpers';

EditApiHeader.propTypes = {
  api: PropTypes.object.isRequired,
  applicationName: PropTypes.string.isRequired,
  saveChanges: PropTypes.func.isRequired,
  canSaveChanges: PropTypes.bool.isRequired,
  deleteApi: PropTypes.func.isRequired,
  deleteEventApi: PropTypes.func.isRequired,
};

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

function navigateToApiDetails() {
  LuigiClient.linkManager()
    .fromClosestContext()
    .navigate('');
}

export default function EditApiHeader({
  api,
  applicationName,
  saveChanges,
  canSaveChanges,
  deleteApi,
  deleteEventApi,
}) {
  const performDelete = () => {
    const isApi = 'targetURL' in api;
    const mutation = isApi ? deleteApi : deleteEventApi;
    handleDelete('Api', api.id, api.name, mutation, navigateToApplication);
  };

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
              onClick={navigateToApplication}
            />
            <Breadcrumb.Item
              name={api.name}
              url="#"
              onClick={navigateToApiDetails}
            />
          </Breadcrumb>
          <ActionBar.Header title={`Edit ${api.name}`} />
        </section>
        <ActionBar.Actions>
          <Button
            onClick={saveChanges}
            disabled={!canSaveChanges}
            option="emphasized"
          >
            Save
          </Button>
          <Button onClick={performDelete} option="light" type="negative">
            Delete
          </Button>
        </ActionBar.Actions>
      </section>
      <PanelGrid nogap cols={4}>
        <PanelEntry
          title="Type"
          children={getApiDisplayName(api) || <em>Not provided</em>}
        />
      </PanelGrid>
    </header>
  );
}
