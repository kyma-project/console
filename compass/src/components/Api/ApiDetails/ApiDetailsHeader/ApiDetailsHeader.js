import React from 'react';
import PropTypes from 'prop-types';

import { ActionBar } from 'fundamental-react';
import LuigiClient from '@kyma-project/luigi-client';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  PanelGrid,
} from '@kyma-project/react-components';

import { handleDelete } from 'react-shared';

import PanelEntry from '../../../../shared/components/PanelEntry/PanelEntry.component';
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
    apiType: PropTypes.oneOf(['openapi', 'asyncapi']).isRequired,
    api: PropTypes.object.isRequired,
    application: PropTypes.object.isRequired,
    deleteMutation: PropTypes.func.isRequired,
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
            <Button onClick={() => LuigiClient.linkManager().navigate('edit')}>
              Edit
            </Button>
            <Button
              onClick={() =>
                handleDelete(
                  this.props.apiType,
                  this.props.api.id,
                  this.props.api.name,
                  this.props.deleteMutation,
                  () => {
                    navigateToApplication();
                  },
                )
              }
              option="light"
              type="negative"
            >
              Delete
            </Button>
          </ActionBar.Actions>
        </section>
        <PanelGrid nogap cols={4}>
          <PanelEntry title="Type" content={<p>{this.props.apiType}</p>} />
        </PanelGrid>
      </header>
    );
  }
}

export default ApiDetailsHeader;
