import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { Breadcrumb, Panel } from 'fundamental-react';

export const ResourceNotFound = ({ resource, breadcrumb, path }) => {
  const navigate = () =>
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(path);

  return (
    <>
      <header className="fd-page__header fd-page__header--columns fd-has-background-color-background-2">
        <section className="fd-section">
          <div className="fd-action-bar">
            <div className="fd-action-bar__header">
              <Breadcrumb>
                <Breadcrumb.Item name={breadcrumb} url="#" onClick={navigate} />
                <Breadcrumb.Item />
              </Breadcrumb>
            </div>
          </div>
        </section>
      </header>
      <Panel className="fd-has-margin-large">
        <Panel.Body className="fd-has-text-align-center">
          <span className="fd-has-type-4">Such {resource} doesn't exists.</span>
        </Panel.Body>
      </Panel>
    </>
  );
};

ResourceNotFound.propTypes = {
  resource: PropTypes.string.isRequired,
  breadcrumb: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};
