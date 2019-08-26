import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { ActionBar, Badge } from 'fundamental-react';
import {
  Button,
  Breadcrumb,
  Panel,
  PanelGrid,
} from '@kyma-project/react-components';

import '../../../../shared/styles/header.scss';
import handleDelete from '../../../../shared/components/GenericList/actionHandlers/simpleDelete';

function navigateToApplications() {
  LuigiClient.linkManager()
    .fromClosestContext()
    .navigate(`/applications`);
}

function connectApplication(applicationId) {
  console.log('todo connect (#1042)', applicationId);
}

function editApplication(applicationId) {
  console.log('todo edit (#1042)', applicationId);
}

class ApplicationDetailsHeader extends React.Component {
  PropTypes = {
    application: PropTypes.object.isRequired,
  };

  render() {
    const isReadOnly = false; //todo
    const { id, name, status, description } = this.props.application;

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
            <Button onClick={() => editApplication(id)} option="light">
              Edit
            </Button>
            <Button
              onClick={() => {
                handleDelete(
                  'Application',
                  this.props.application.id,
                  this.props.application.name,
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
