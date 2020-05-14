import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import { useMutation } from '@apollo/react-hooks';

import { ActionBar, Badge } from 'fundamental-react';
import { Button, Breadcrumb, PanelGrid } from '@kyma-project/react-components';

import { handleDelete } from 'react-shared';

import PanelEntry from '../../../../shared/components/PanelEntry/PanelEntry.component';
import '../../../../shared/styles/header.scss';

import ModalWithForm from './../../../../shared/components/ModalWithForm/ModalWithForm';
import UpdateApplicationForm from './../UpdateApplicationForm/UpdateApplicationForm.container';
import ConnectApplicationModal from './../ConnectApplicationModal/ConnectApplicationModal';

import { ApplicationQueryContext } from '../ApplicationDetails';
import { UNREGISTER_APPLICATION_MUTATION } from '../../../Applications/gql';

function navigateToApplications() {
  LuigiClient.linkManager()
    .fromContext('tenant')
    .navigate(`/applications`);
}

ApplicationDetailsHeader.propTypes = {
  application: PropTypes.object.isRequired,
};

function ApplicationDetailsHeader({ application }) {
  const [deleteApplicationMutation] = useMutation(
    UNREGISTER_APPLICATION_MUTATION,
    {
      variables: { id: application.id },
    },
  );

  const isReadOnly = false; //todo
  const { id, name, status, description, providerName } = application;

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
            <Breadcrumb.Item />
          </Breadcrumb>
          <ActionBar.Header title={name} />
        </section>
        <ActionBar.Actions>
          {/* todo can be readonly */}
          {!isReadOnly && <ConnectApplicationModal applicationId={id} />}
          <ApplicationQueryContext.Consumer>
            {applicationQuery => (
              <ModalWithForm
                title="Update Application"
                button={{ text: 'Edit', option: 'light' }}
                confirmText="Update"
                initialIsValid={true}
                performRefetch={applicationQuery.refetch}
                renderForm={props => (
                  <UpdateApplicationForm application={application} {...props} />
                )}
              />
            )}
          </ApplicationQueryContext.Consumer>
          <Button
            onClick={() => {
              handleDelete(
                'Application',
                id,
                name,
                deleteApplicationMutation,
                navigateToApplications,
              );
            }}
            option="light"
            type="negative"
          >
            Delete
          </Button>
        </ActionBar.Actions>
      </section>
      <PanelGrid nogap cols={4}>
        <PanelEntry title="Provider Name" children={<p>{providerName}</p>} />
        <PanelEntry title="Description" children={<p>{description}</p>} />
        <PanelEntry
          title="Status"
          children={<Badge>{status.condition}</Badge>}
        />
      </PanelGrid>
    </header>
  );
}
export default ApplicationDetailsHeader;
