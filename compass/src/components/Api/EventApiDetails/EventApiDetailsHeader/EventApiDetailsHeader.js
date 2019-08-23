import React from 'react';
import PropTypes from 'prop-types';
import { ActionBar } from 'fundamental-react';
import LuigiClient from '@kyma-project/luigi-client';
import { Breadcrumb, BreadcrumbItem } from '@kyma-project/react-components';

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

class EventApiDetailsHeader extends React.Component {

  PropTypes = {
    eventApi: PropTypes.object.isRequired,
    application: PropTypes.object.isRequired
  };

  render() {
    return (
      <header className="fd-has-background-color-background-2">
        <section className="fd-has-padding-regular fd-has-padding-bottom-none">
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
          <ActionBar.Header title={this.props.eventApi.name} />
        </section>
      </header>
    );
  }
}
export default EventApiDetailsHeader;
