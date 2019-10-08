import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { ActionBar } from 'fundamental-react';
import { Breadcrumb, Button } from '@kyma-project/react-components';

import handleDelete from '../../../../shared/components/GenericList/actionHandlers/simpleDelete';
import { nonDeletableScenarioNames } from '../../../../shared/constants';

ScenarioDetailsHeader.propTypes = {
  scenarioName: PropTypes.string.isRequired,
  getScenariosSchema: PropTypes.func.isRequired,
  deleteScenarioMutation: PropTypes.func.isRequired,
};

function navigateToList() {
  LuigiClient.linkManager()
    .fromClosestContext()
    .navigate('scenarios');
}

export default function ScenarioDetailsHeader({
  scenarioName,
  getScenariosSchema,
  deleteScenarioMutation,
}) {
  if (getScenariosSchema.loading) {
    return <p>Loading...</p>;
  }
  if (getScenariosSchema.error) {
    return `Error! ${getScenariosSchema.error.message}`;
  }

  const canDelete = () => nonDeletableScenarioNames.includes(scenarioName);

  const deleteScenario = () => {
    handleDelete(
      'Metadata Definition',
      scenarioName,
      scenarioName,
      name => deleteScenarioMutation(name, getScenariosSchema.labelDefinition),
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
          <Button onClick={() => console.log('todo')}>Edit</Button>
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
