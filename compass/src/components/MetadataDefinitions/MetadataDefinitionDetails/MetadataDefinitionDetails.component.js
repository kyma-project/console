import React, { useState } from 'react';
import { ActionBar } from 'fundamental-react';
import {
  Button,
  Breadcrumb,
  Panel,
  PanelHead,
  PanelHeader,
  PanelBody,
  Input,
} from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';

import '../../../shared/styles/header.scss';
import ResourceNotFound from '../../Shared/ResourceNotFound.component';
import JSONEditorComponent from '../../Shared/JSONEditor';

var ajv = new require('ajv')();

const MetadataDefinitionDetails = ({
  metadataDefinition: metadataDefinitionQuery,
  updateLabelDefinition,
  sendNotification,
}) => {
  const [isSchemaValid, setSchemaValid] = useState(true);
  const [schema, setSchema] = useState(null);
  const [schemaError, setSchemaError] = useState(null);

  const handleSchemaChange = currentSchema => {
    LuigiClient.uxManager().setDirtyStatus(true);
    try {
      const parsedSchema = JSON.parse(currentSchema);

      if (typeof parsedSchema.properties !== 'object')
        throw new Error(
          'A schema should have a "properties" key that is an object',
        );
      if (!ajv.validateSchema(parsedSchema))
        throw new Error('Provided JSON is not a valid schema');
      setSchema(parsedSchema);
      setSchemaError(null);
      setSchemaValid(true);
    } catch (e) {
      setSchemaError(e.message);
      setSchemaValid(false);
    }
  };

  const handleSaveChanges = async definitionKey => {
    try {
      await updateLabelDefinition({
        key: definitionKey,
        schema,
      });

      await sendNotification({
        variables: {
          content: 'Metadata definition has been saved succesfully',
          title: 'Success',
          color: '#107E3E',
          icon: 'accept',
        },
      });
      metadataDefinitionQuery.refetch(); //  to format the JSON
    } catch (e) {
      sendNotification({
        variables: {
          content: e.message,
          title: 'There was a problem with saving Metadata definition',
          color: '#BB0000',
          icon: 'decline',
        },
      });
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
  LuigiClient.uxManager().setDirtyStatus(false);

  if (schema === null && metadataDefinition.schema) {
    setSchema(metadataDefinition.schema); // to assign the schema to state initially
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
            <Input
              type="hidden"
              isError={schemaError}
              message={schemaError}
            ></Input>
          </PanelBody>
        </Panel>
      </section>
    </>
  );
};

export default MetadataDefinitionDetails;
