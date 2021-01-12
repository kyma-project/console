import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Breadcrumb } from 'fundamental-react';
import './PageHeader.scss';
import LuigiClient from '@luigi-project/client';

const Column = ({ title, children, columnSpan }) => {
  const style = columnSpan !== undefined ? { gridColumn: columnSpan } : {};
  return (
    <div className="page-header__column" style={style}>
      <div className="title fd-has-color-text-4 fd-has-margin-bottom-none">
        {title}
      </div>
      <span className="content fd-has-color-text-1">{children}</span>
    </div>
  );
};
const performOnClick = item => {
  if (!item.path) {
    return null;
  }

  let linkManager = LuigiClient.linkManager();
  if (!item.fromAbsolutePath) {
    linkManager = item.fromContext
      ? linkManager.fromContext(item.fromContext)
      : linkManager.fromClosestContext();
  }

  if (!item.params) {
    return linkManager.navigate(item.path);
  }

  return linkManager.withParams(item.params).navigate(item.path);
};

export const PageHeader = ({
  title,
  description,
  breadcrumbItems,
  actions,
  children,
  columnWrapperClassName,
}) => (
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

        <Panel.Head title={title} aria-label="title" />
        {/* don't use Panel.Head's description, as it accepts only strings */}
        {description && <p className="description">{description}</p>}
        <section className={`column-wrapper ${columnWrapperClassName}`}>
          {' '}
          {children}
        </section>
      </section>

      {actions && (
        <Panel.Actions className="fd-has-margin-left-s">
          {actions}
        </Panel.Actions>
      )}
    </Panel.Header>
  </Panel>
);
PageHeader.Column = Column;

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
      params: PropTypes.object,
      fromContext: PropTypes.string,
      fromAbsolutePath: PropTypes.bool,
    }),
  ),
};

PageHeader.defaultProps = {
  breadcrumbItems: [],
  description: '',
};
