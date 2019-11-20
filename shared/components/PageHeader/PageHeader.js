import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'fundamental-react';
import './PageHeader.scss';

export const PageHeader = ({ title }) => (
  <Panel className="page-header">
    <Panel.Header className="fd-has-padding-m">
      <Panel.Head title={title} />
    </Panel.Header>
  </Panel>
);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
};
