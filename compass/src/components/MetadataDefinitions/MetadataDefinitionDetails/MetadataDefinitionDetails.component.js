import React, { useState } from 'react';
import { ActionBar } from 'fundamental-react';
import {
  Button,
  Breadcrumb,
  Panel,
  PanelHead,
  PanelHeader,
  PanelBody,
} from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';

import '../../../shared/styles/header.scss';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import JSONEditorComponent from '../../Shared/JSONEditor';

const MetadataDefinitionDetails = ({
  metadataDefinition: metadataDefinitionQuery,
  updateLabelDefinition,
}) => {
  const [isSchemaValid, setSchemaValid] = useState(true);
  const [schema, setSchema] = useState({});

  const handleSchemaChange = schema => {
    try {
      setSchema(JSON.parse(schema));

      setSchemaValid(true);
    } catch {
      setSchemaValid(false);
    }
  };

  const handleSaveChanges = async definitionKey => {
    try {
      await updateLabelDefinition({
        key: definitionKey,
        schema,
      });
      metadataDefinitionQuery.refetch(); //  to format the JSON
      // onCompleted(runtimeName, `Runtime created succesfully`);
    } catch (e) {
      //onError(`The runtime could not be created succesfully`, e.message || ``);
    }
  };

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
    return null;
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
            <Button
              onClick={() => handleSaveChanges(metadataDefinition.key)}
              disabled={!isSchemaValid}
              option="emphasized"
            >
              Save
            </Button>
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
              onChangeText={handleSchemaChange}
              text={JSON.stringify(metadataDefinition.schema || {}, null, 2)}
            />
          </PanelBody>
        </Panel>
      </section>
    </>
  );
};

export default MetadataDefinitionDetails;
