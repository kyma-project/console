import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';

import { ActionBar, Breadcrumb, Button } from 'fundamental-react';
import { PanelGrid } from '@kyma-project/react-components';

import { PageHeader, handleDelete } from 'react-shared';

import PanelEntry from '../../../../shared/components/PanelEntry/PanelEntry.component';
import '../../../../shared/styles/header.scss';
import { getApiDisplayName } from './../../ApiHelpers';

function navigateToApplication() {
  LuigiClient.linkManager()
    .fromContext('application')
    .navigate('');
}

function navigateToApplications() {
  LuigiClient.linkManager()
    .fromContext('tenant')
    .navigate('/applications');
}

class ApiDetailsHeader extends React.Component {
  PropTypes = {
    apiType: PropTypes.oneOf(['openapi', 'asyncapi']).isRequired,
    api: PropTypes.object.isRequired,
    apiPackage: PropTypes.object.isRequired,
    application: PropTypes.object.isRequired,
    deleteMutation: PropTypes.func.isRequired,
  };

  render() {
    const { api, apiPackage, application, deleteMutation } = this.props;

    const breadcrumbItems = [
      { name: 'Applications', path: '/' },
      { name: application.name, path: '/' },
      {
        name: apiPackage.name,
        path: `/apiPackage/${apiPackage.id}`,
      },
      {
        name: api.name,
        path: `/apiPackage/${apiPackage.id}/${'KURWA'}/${api.id}`,
      },
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

    // return (
    //   <header className="fd-has-background-color-background-2">
    //     <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
    //       <section>
    //         <Breadcrumb>
    //           <Breadcrumb.Item
    //             name="Applications"
    //             url="#"
    //             onClick={navigateToApplications}
    //           />
    //           <Breadcrumb.Item
    //             name={this.props.application.name}
    //             url="#"
    //             onClick={navigateToApplication}
    //           />
    //           <Breadcrumb.Item name={this.props.api.name} url="#" />
    //         </Breadcrumb>
    //         <ActionBar.Header title={this.props.api.name} />
    //       </section>
    //       <ActionBar.Actions></ActionBar.Actions>
    //     </section>
    //     <PanelGrid nogap cols={4}>
    //       <PanelEntry
    //         title="Type"
    //         children={

    //         }
    //       />
    //     </PanelGrid>
    //   </header>
    // );
  }
}
export default ApiDetailsHeader;
