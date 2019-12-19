import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Breadcrumb } from 'fundamental-react';
import './PageHeader.scss';
import LuigiClient from '@kyma-project/luigi-client';

export const PageHeader = ({ title, breadcrumbItems, children }) => (
  <Panel className="page-header">
    <Panel.Header className="fd-has-padding-m">
      <section>
        {breadcrumbItems.length ? (
          <section className="fd-has-margin-bottom-s">
            <Breadcrumb>
              {breadcrumbItems.map(item => (
                <Breadcrumb.Item
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
              ))}
            </Breadcrumb>
          </section>
        ) : null}

        <Panel.Head title={title} />
      </section>
      {children && <Panel.Actions>{children}</Panel.Actions>}
    </Panel.Header>
  </Panel>
);

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
