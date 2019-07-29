import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import classnames from 'classnames';

import { ActionBar } from 'fundamental-react/lib/ActionBar';
import {
  Button,
  Breadcrumb,
  Panel,
  PanelGrid,
} from '@kyma-project/react-components';

import LabelDisplay from '../../../Shared/LabelDisplay';
import {
  determineClass,
  printPrettyConnectionStatus,
} from './../../applicationUtility';
import '../../../../shared/styles/header.scss';

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

  delete = async element => {
    try {
      await this.props.deleteApplication(element.id);
      LuigiClient.linkManager()
        .fromClosestContext()
        .navigate(`/applications`);
    } catch (e) {
      LuigiClient.uxManager().showAlert({
        text: `Error occored during deletion ${e.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  handleDelete = application => {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: 'Remove application',
        body: `Are you sure you want to delete application "${application.name}"?`,
        buttonConfirm: 'Delete',
        buttonDismiss: 'Cancel',
      })
      .then(() => {
        this.delete(application);
      })
      .catch(() => {});
  };

  render() {
    const isReadOnly = false; //todo
    const { id, name, status, description, labels } = this.props.application;

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
              onClick={() => this.handleDelete(this.props.application)}
              option="light"
              type="negative"
            >
              Delete
            </Button>
          </ActionBar.Actions>
        </section>
        <PanelGrid nogap cols={4}>
          <PanelEntry title="Name" content={<p>{name}</p>} />
          <PanelEntry
            title="Status"
            content={
              <p>
                <span
                  className={classnames(
                    'fd-status-label',
                    determineClass(status.condition),
                  )}
                >
                  {printPrettyConnectionStatus(status.condition)}
                </span>
              </p>
            }
          />
          <PanelEntry title="Description" content={<p>{description}</p>} />
          {labels && !labels.length && (
            <PanelEntry
              title="Labels"
              content={labels && <LabelDisplay labels={labels} />}
            />
          )}
        </PanelGrid>
      </header>
    );
  }
}
export default ApplicationDetailsHeader;
