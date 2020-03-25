import React from 'react';
import LuigiClient from '@luigi-project/client';
import { Breadcrumb, Panel, PanelBody } from '@kyma-project/react-components';

const ResourceNotFound = ({
  resource,
  breadcrumb,
  navigationPath,
  navigationContext,
}) => (
  <>
    <header className="fd-page__header fd-page__header--columns fd-has-background-color-background-2">
      <section className="fd-section">
        <div className="fd-action-bar">
          <div className="fd-action-bar__header">
            <Breadcrumb>
              <Breadcrumb.Item
                name={breadcrumb}
                url="#"
                onClick={() =>
                  navigateToList({
                    breadcrumb,
                    navigationPath,
                    navigationContext,
                  })
                }
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

const navigateToList = ({ breadcrumb, navigationPath, navigationContext }) => {
  const path = navigationPath ? navigationPath : `/${breadcrumb.toLowerCase()}`;
  navigationContext
    ? LuigiClient.linkManager()
        .fromContext(navigationContext)
        .navigate(path)
    : LuigiClient.linkManager()
        .fromClosestContext()
        .navigate(path);
};

export default ResourceNotFound;
