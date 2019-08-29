import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { Breadcrumb, Panel, PanelBody } from '@kyma-project/react-components';

const ResourceNotFound = ({ resource, breadcrumb }) => (
  <>
    <header className="fd-page__header fd-page__header--columns fd-has-background-color-background-2">
      <section className="fd-section">
        <div className="fd-action-bar">
          <div className="fd-action-bar__header">
            <Breadcrumb>
              <Breadcrumb.Item
                name={breadcrumb}
                url="#"
                onClick={e => navigateToList(breadcrumb)}
              />
              <Breadcrumb.Item />
            </Breadcrumb>
          </div>
        </div>
      </section>
    </header>
    <Panel className="fd-has-margin-large">
      <PanelBody className="fd-has-text-align-center fd-has-type-4">
        Such {resource} doesn't exists for this Tenant.
      </PanelBody>
    </Panel>
  </>
);

const navigateToList = breadcrumb => {
  breadcrumb = breadcrumb.toLowerCase();
  LuigiClient.linkManager()
    .fromContext('tenant')
    .navigate(`/${breadcrumb}`);
};

export default ResourceNotFound;
