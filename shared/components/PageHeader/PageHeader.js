import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Breadcrumb } from 'fundamental-react';
import './PageHeader.scss';
import LuigiClient from '@kyma-project/luigi-client';

const Column = ({ title, children, columnSpan = 1 }) => (
  <div className="page-header__column" style={{ gridColumn: columnSpan }}>
    <p className="title fd-has-type-0 fd-has-color-text-4 fd-has-margin-bottom-none">
      {title}
    </p>
    <span className="content fd-has-type-0 fd-has-color-text-1">
      {children}
    </span>
  </div>
);

const performOnClick = item => {
  if (!item.path) {
    return null;
  }

  if (!item.params) {
    return LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(item.path);
  }

  return LuigiClient.linkManager()
    .fromClosestContext()
    .withParams(item.params)
    .navigate(item.path);
};

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
                    onClick={() => performOnClick(item)}
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
      params: PropTypes.object,
    }),
  ),
};

PageHeader.defaultProps = {
  breadcrumbItems: [],
};
