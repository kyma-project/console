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
import './styles.scss';

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

function deleteApplication(applicationId) {
  console.log('todo delete (#1043)', applicationId);
}

ApplicationDetailsHeader.propTypes = {
  application: PropTypes.object.isRequired,
};

export default function ApplicationDetailsHeader(props) {
  const isReadOnly = false; //todo

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

  const { id, name, status, description, labels } = props.application;

  return (
    <header className="application-details-header">
      <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
        <section className="action-bar-wrapper__left-panel">
          <Breadcrumb>
            <Breadcrumb.Item
              name="Applications"
              url="#"
              onClick={navigateToApplications}
            />
            <Breadcrumb.Item />
          </Breadcrumb>
          <ActionBar.Header title={props.application.name} />
        </section>
        <ActionBar.Actions>
          {/* todo can be readonly */}
          {!isReadOnly && (
            <Button onClick={() => connectApplication(id)} option="emphasized">
              Connect Application
            </Button>
          )}
          <Button onClick={() => editApplication(id)} option="light">
            Edit
          </Button>
          <Button
            onClick={() => deleteApplication(id)}
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
