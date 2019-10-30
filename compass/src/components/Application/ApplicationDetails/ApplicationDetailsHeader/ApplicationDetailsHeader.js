import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { ActionBar, Badge } from 'fundamental-react';
import { Button, Breadcrumb, PanelGrid } from '@kyma-project/react-components';

import PanelEntry from '../../../../shared/components/PanelEntry/PanelEntry.component';
import '../../../../shared/styles/header.scss';
import handleDelete from '../../../../shared/components/GenericList/actionHandlers/simpleDelete';
import ModalWithForm from './../../../../shared/components/ModalWithForm/ModalWithForm.container';
import UpdateApplicationForm from './../UpdateApplicationForm/UpdateApplicationForm.container';

import { ApplicationQueryContext } from './../ApplicationDetails.component';

function navigateToApplications() {
  LuigiClient.linkManager()
    .fromContext('tenant')
    .navigate(`/applications`);
}

function connectApplication(applicationId) {
  console.log('todo connect', applicationId);
}

class ApplicationDetailsHeader extends React.Component {
  PropTypes = {
    application: PropTypes.object.isRequired,
  };

  render() {
    const isReadOnly = false; //todo
    const { id, name, status, description } = this.props.application;

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
            {!isReadOnly && (
              <Button
                onClick={() => connectApplication(id)}
                option="emphasized"
              >
                Connect Application
              </Button>
            )}
            <ApplicationQueryContext.Consumer>
              {applicationQuery => (
                <ModalWithForm
                  title="Update Application"
                  button={{ text: 'Edit', option: 'light' }}
                  confirmText="Update"
                  initialIsValid={true}
                  performRefetch={applicationQuery.refetch}
                >
                  <UpdateApplicationForm application={this.props.application} />
                </ModalWithForm>
              )}
            </ApplicationQueryContext.Consumer>
            <Button
              onClick={() => {
                handleDelete(
                  'Application',
                  id,
                  name,
                  this.props.deleteApplication,
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
          <PanelEntry title="Description" content={<p>{description}</p>} />
          <PanelEntry
            title="Status"
            content={<Badge>{status.condition}</Badge>}
          />
        </PanelGrid>
      </header>
    );
  }
}
export default ApplicationDetailsHeader;
