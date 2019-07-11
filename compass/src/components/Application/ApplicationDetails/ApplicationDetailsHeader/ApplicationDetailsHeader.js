import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import classnames from 'classnames';

import { Breadcrumb } from 'fundamental-react/lib/Breadcrumb';
import { ActionBar } from 'fundamental-react/lib/ActionBar';
import { Button } from 'fundamental-react/lib/Button';
import { Panel, PanelGrid } from 'fundamental-react/lib/Panel';

import LabelDisplay from '../../../Shared/LabelDisplay';
import {
  determineClass,
  printPrettyConnectionStatus,
} from './../../applicationUtility';
import { TitlebarWrapper, Header, ActionBarWrapper } from './styled';

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

export default props => {
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
    <Header>
      <ActionBarWrapper className="fd-has-padding-regular fd-has-padding-bottom-none">
        <TitlebarWrapper>
          <Breadcrumb>
            <Breadcrumb.Item
              name="Applications"
              url="#"
              onClick={navigateToApplications}
            />
            <Breadcrumb.Item />
          </Breadcrumb>
          <ActionBar.Header title={props.application.name} />
        </TitlebarWrapper>
        <ActionBar.Actions>
          {/* todo moze być readonly */}
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
      </ActionBarWrapper>
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
    </Header>
  );
};
