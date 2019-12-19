import React, { useContext } from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { ActionBar } from 'fundamental-react';
import { Breadcrumb, Button } from '@kyma-project/react-components';

import { handleDelete } from 'react-shared';
import ScenarioNameContext from './../ScenarioNameContext';

import { GET_SCENARIOS_LABEL_SCHEMA, UPDATE_SCENARIOS } from '../../gql';
import { nonDeletableScenarioNames } from './../../../../shared/constants';

function navigateToList() {
  LuigiClient.linkManager()
    .fromClosestContext()
    .navigate('scenarios');
}

function removeScenario(schema, scenarioName) {
  const schemaObject = JSON.parse(schema);
  schemaObject.items.enum = schemaObject.items.enum.filter(
    s => s !== scenarioName,
  );
  return JSON.stringify(schemaObject);
}

function createNewInputForDeleteScenarioMutation(
  labelDefinition,
  scenarioName,
) {
  const newSchema = removeScenario(labelDefinition.schema, scenarioName);
  return {
    key: 'scenarios',
    schema: newSchema,
  };
}

export default function ScenarioDetailsHeader({ applicationsCount }) {
  const scenarioName = useContext(ScenarioNameContext);

  const { data: scenariosLabelSchema, error, loading } = useQuery(
    GET_SCENARIOS_LABEL_SCHEMA,
  );
  const [deleteScenarioMutation] = useMutation(UPDATE_SCENARIOS);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>`Error! ${error.message}`</p>;
  }

  const canDelete = () => {
    return (
      nonDeletableScenarioNames.includes(scenarioName) ||
      applicationsCount !== 0
    );
  };

  const deleteScenario = () => {
    handleDelete(
      'Scenario',
      scenarioName,
      scenarioName,
      name =>
        deleteScenarioMutation({
          variables: {
            in: createNewInputForDeleteScenarioMutation(
              scenariosLabelSchema.labelDefinition,
              name,
            ),
          },
        }),
      navigateToList,
    );
  };

  return (
    <header className="fd-has-background-color-background-2">
      <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
        <section>
          <Breadcrumb>
            <Breadcrumb.Item
              name="Scenarios"
              url="#"
              onClick={navigateToList}
            />
            <Breadcrumb.Item />
          </Breadcrumb>
          <ActionBar.Header title={scenarioName} />
        </section>
        <ActionBar.Actions>
          <Button
            disabled={canDelete()}
            onClick={deleteScenario}
            option="light"
            type="negative"
          >
            Delete
          </Button>
        </ActionBar.Actions>
      </section>
    </header>
  );
}
