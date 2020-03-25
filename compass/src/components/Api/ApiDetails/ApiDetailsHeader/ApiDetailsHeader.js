import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';

import { Button } from 'fundamental-react';

import { PageHeader, handleDelete } from 'react-shared';

import '../../../../shared/styles/header.scss';
import { getApiDisplayName } from './../../ApiHelpers';

function navigateToApplication() {
  LuigiClient.linkManager()
    .fromContext('application')
    .navigate('');
}

class ApiDetailsHeader extends React.Component {
  PropTypes = {
    api: PropTypes.object.isRequired,
    apiPackage: PropTypes.object.isRequired,
    application: PropTypes.object.isRequired,
    deleteMutation: PropTypes.func.isRequired,
  };

  render() {
    const { api, apiPackage, application, deleteMutation } = this.props;

    const breadcrumbItems = [
      { name: 'Applications', path: '/applications', fromContext: 'tenant' },
      { name: application.name, path: '/', fromContext: 'application' },
      { name: apiPackage.name, path: '/', fromContext: 'api-package' },
      { name: '' },
    ];

    const actions = (
      <>
        <Button onClick={() => LuigiClient.linkManager().navigate('edit')}>
          Edit
        </Button>
        <Button
          onClick={() =>
            handleDelete('API', api.id, api.name, deleteMutation, () => {
              navigateToApplication();
            })
          }
          option="light"
          type="negative"
        >
          Delete
        </Button>
      </>
    );

    return (
      <PageHeader
        title={api.name}
        breadcrumbItems={breadcrumbItems}
        actions={actions}
      >
        <PageHeader.Column title="Type">
          {getApiDisplayName(this.props.api) || <em>Not provided</em>}
        </PageHeader.Column>
      </PageHeader>
    );
  }
}
export default ApiDetailsHeader;
