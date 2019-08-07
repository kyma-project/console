import React from 'react';
import { ActionBar, Badge } from 'fundamental-react';
import {
  Button,
  Breadcrumb,
  Panel,
  PanelHead,
  PanelHeader,
  PanelBody,
  PanelGrid,
  PanelEntry,
} from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';

import '../../../shared/styles/header.scss';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import JSONEditorComponent from '../../Shared/JSONEditor';

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
                name="Metadata Definitions"
                url="#"
                onClick={() =>
                  LuigiClient.linkManager()
                    .fromClosestContext()
                    .navigate(`/metadata-definitions`)
                }
              />
              <Breadcrumb.Item />
            </Breadcrumb>
            <ActionBar.Header
              title={metadataDefinition.key || 'Loading name...'}
            />
          </section>
          <ActionBar.Actions>
            <Button option="emphasized">Save</Button>
          </ActionBar.Actions>
        </section>
      </header>
      <section className="fd-section">
        <Panel>
          <PanelHeader>
            <PanelHead title="Schema" />
          </PanelHeader>

          <PanelBody>
            <JSONEditorComponent
              onSuccess={() => console.log('success')}
              text={'gdsg'}
            />
          </PanelBody>
        </Panel>
      </section>
    </>
  );
};

export default MetadataDefinitionDetails;
