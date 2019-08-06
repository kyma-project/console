import React from 'react';
import { ActionBar, Badge } from 'fundamental-react';
import {
  Button,
  Breadcrumb,
  Panel,
  PanelGrid,
  PanelEntry,
} from '@kyma-project/react-components';

import '../../../shared/styles/header.scss';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';

const MetadataDefinitionDetails = ({
  metadataDefinition: metadataDefinitionQuery,
}) => {
  const metadataDefinition =
    (metadataDefinitionQuery && metadataDefinitionQuery.labelDefinition) || {};
  const loading = metadataDefinitionQuery.loading;
  const error = metadataDefinitionQuery.error;

  if (!metadataDefinitionQuery) {
    if (loading) return 'Loading...';
    if (error)
      return (
        <ResourceNotFound
          resource="Metadata Definition"
          breadcrumb="MetadataDefinitions"
        />
      );
    return '';
  }
  if (error) {
    return `Error! ${error.message}`;
  }

  return (
    <>
      <header className="fd-has-background-color-background-2">
        <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
          <section>
            <Breadcrumb>
              <Breadcrumb.Item
                name="Applications"
                url="#"
                // onClick={navigateToApplications}
              />
              <Breadcrumb.Item />
            </Breadcrumb>
            <ActionBar.Header title="title" />
          </section>
          <ActionBar.Actions></ActionBar.Actions>
        </section>
        <PanelGrid nogap cols={4}></PanelGrid>
      </header>
      <section className="fd-section">aa</section>
    </>
  );
};

export default MetadataDefinitionDetails;
