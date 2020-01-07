import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Breadcrumb, PanelGrid } from 'fundamental-react';
import './PageHeader.scss';
import LuigiClient from '@kyma-project/luigi-client';

const Column = ({ title, children }) => (
  <div className="page-header__column ">
    <p className="title fd-has-type-0 fd-has-color-text-4 fd-has-margin-bottom-none">
      {title}
    </p>
    <span className="content fd-has-type-0 fd-has-color-text-1">
      {children}
    </span>
  </div>
);

export const PageHeader = ({ title, breadcrumbItems, actions, children }) => (
  <Panel className="page-header">
    <Panel.Header>
      <section className="header-wrapper">
        {breadcrumbItems.length ? (
          <section className="fd-has-margin-bottom-s">
            <Breadcrumb>
              {breadcrumbItems.map(item => {
                return (
                  <Breadcrumb.Item
                    aria-label="breadcrumb-item"
                    key={item.name}
                    name={item.name}
                    url="#"
                    onClick={() =>
                      item.path
                        ? LuigiClient.linkManager()
                            .fromClosestContext()
                            .navigate(item.path)
                        : null
                    }
                  />
                );
              })}
            </Breadcrumb>
          </section>
        ) : null}

        <Panel.Head title={title} />
        <section className="column-wrapper"> {children}</section>
      </section>

      {actions && <Panel.Actions>{actions}</Panel.Actions>}
    </Panel.Header>
  </Panel>
);
PageHeader.Column = Column;

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
    }),
  ),
};

PageHeader.defaultProps = {
  breadcrumbItems: [],
};
