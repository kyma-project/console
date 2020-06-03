import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import { PageHeader, StatusBadge, EMPTY_TEXT_PLACEHOLDER } from 'react-shared';
import '../../../../shared/styles/header.scss';

class RuntimeDetailsHeader extends React.Component {
  PropTypes = {
    runtime: PropTypes.object.isRequired,
  };

  navigateToRuntimesList = () => {
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate('');
  };

  render = () => {
    const { name, description, id, status } = this.props.runtime;
    const breadcrumbItems = [{ name: 'Runtimes', path: '/' }, { name: '' }];

    return (
      <PageHeader breadcrumbItems={breadcrumbItems} title={name}>
        {status && (
          <PageHeader.Column title="Status" columnSpan={null}>
            {<StatusBadge autoResolveType>{status.condition}</StatusBadge>}
          </PageHeader.Column>
        )}
        <PageHeader.Column title="Description" columnSpan={null}>
          {description ? description : EMPTY_TEXT_PLACEHOLDER}
        </PageHeader.Column>
        <PageHeader.Column title="ID" columnSpan={null}>
          {id}
        </PageHeader.Column>
      </PageHeader>
    );
  };
}

export default RuntimeDetailsHeader;
