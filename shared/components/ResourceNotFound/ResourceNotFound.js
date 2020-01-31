import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { Breadcrumb, Panel, PanelBody } from '@kyma-project/react-components';

export const ResourceNotFound = ({ resource, path }) => {
  const navigate = breadcrumb => {
    breadcrumb = breadcrumb.toLowerCase();
    LuigiClient.linkManager()
      .fromContext(breadcrumb)
      .navigate('/');
  };

  return (
    <>
      <header className="fd-page__header fd-page__header--columns fd-has-background-color-background-2">
        <section className="fd-section">
          <div className="fd-action-bar">
            <div className="fd-action-bar__header">
              <Breadcrumb>
                <Breadcrumb.Item
                  name={breadcrumb}
                  url="#"
                  onClick={() => navigate(breadcrumb)}
                />
                <Breadcrumb.Item />
              </Breadcrumb>
            </div>
          </div>
        </section>
      </header>
      <Panel className="fd-has-margin-large">
        <PanelBody className="fd-has-text-align-center fd-has-type-4">
          Such {resource} doesn't exists.
        </PanelBody>
      </Panel>
    </>
  );
};
