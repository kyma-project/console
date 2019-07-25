import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { Breadcrumb, Panel, PanelBody } from '@kyma-project/react-components';

class ResourceNotFound extends React.Component {
  PropTypes = {
    resource: PropTypes.string.isRequired,
    breadcrumb: PropTypes.string.isRequired
  };

  navigateToList = () => {
    const path = this.props.breadcrumb.toLowerCase();
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(`/${path}`);
  }

  render = () => (
    <>
      <header className="fd-page__header fd-page__header--columns fd-has-background-color-background-2">
        <section className="fd-section">
          <div className="fd-action-bar">
            <div className="fd-action-bar__header">
              <Breadcrumb>
                <Breadcrumb.Item
                  name={this.props.breadcrumb}
                  url="#"
                  onClick={this.navigateToList}
                />
                <Breadcrumb.Item />
              </Breadcrumb>
            </div>
          </div>
        </section>
      </header>
      <Panel className="fd-has-margin-large">
        <PanelBody className="fd-has-text-align-center fd-has-type-4">
          Such {this.props.resource} doesn't exists for this Tenant.
        </PanelBody>
      </Panel>
    </>
  );
}

export default ResourceNotFound