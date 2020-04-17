import React, { useState } from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'deep-equal';
import { Panel, Button } from 'fundamental-react';
import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';
import { useUpdateLambda, UPDATE_TYPE } from 'components/Lambdas/gql/hooks';
import { LambdaReplicas } from './LambdaReplicas';
import { LambdaResources } from './LambdaResources';

import './ResourceManagement.scss';

export function ResourcesManagement({ lambda }) {
  const defaultedReplicas = {
    min: lambda.replicas.min || '1',
    max: lambda.replicas.max || '1',
  };

  const defaultedResources = {
    requests: {
      cpu: lambda.resources.requests.cpu || '',
      memory: lambda.resources.requests.memory || '',
    },
    limits: {
      cpu: lambda.resources.limits.cpu || '',
      memory: lambda.resources.limits.memory || '',
    },
  };

  const [disabledForm, setDisabledForm] = useState(true);
  const [replicas, setReplicas] = useState(defaultedReplicas);
  const [resources, setResources] = useState(defaultedResources);
  const updateLambda = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.RESOURCES_AND_REPLICAS,
  });

  function handleSave() {
    updateLambda({
      replicas,
      resources,
    });
  }

  const saveText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.SAVE;
  const editText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.EDIT;
  return (
    <Panel className="fd-has-margin-m lambda-resources-management">
      <Panel.Header className="fd-has-padding-xs">
        <Panel.Head title={RESOURCES_MANAGEMENT_PANEL.TITLE} />
        <Panel.Actions>
          {!disabledForm && (
            <Button
              glyph="sys-cancel"
              type="negative"
              onClick={() => {
                setReplicas(defaultedReplicas);
                setResources(defaultedResources);
                setDisabledForm(true);
              }}
            >
              {'Cancel'}
            </Button>
          )}
          <Button
            glyph={disabledForm ? 'edit' : 'save'}
            option={disabledForm ? 'light' : 'emphasized'}
            onClick={() => {
              if (
                !disabledForm &&
                (!deepEqual(replicas, defaultedReplicas) ||
                  !deepEqual(resources, defaultedResources))
              ) {
                handleSave();
              }
              setDisabledForm(prev => !prev);
            }}
          >
            {disabledForm ? editText : saveText}
          </Button>
        </Panel.Actions>
      </Panel.Header>
      <Panel.Body className="fd-has-padding-xs">
        <LambdaReplicas
          replicas={disabledForm ? defaultedReplicas : replicas}
          disabledForm={disabledForm}
          setReplicas={setReplicas}
        />
      </Panel.Body>
      <Panel.Body className="fd-has-padding-xs">
        <LambdaResources
          resources={disabledForm ? defaultedResources : resources}
          disabledForm={disabledForm}
          setResources={setResources}
        />
      </Panel.Body>
    </Panel>
  );
}

ResourcesManagement.propTypes = {
  lambda: PropTypes.object.isRequired,
};
