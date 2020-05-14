import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Panel, Button } from 'fundamental-react';

import LambdaReplicas from './LambdaReplicas';
import LambdaResources from './LambdaResources';

import { useUpdateLambda, UPDATE_TYPE } from 'components/Lambdas/gql/hooks';
import {
  BUTTONS,
  RESOURCES_MANAGEMENT_PANEL,
} from 'components/Lambdas/constants';
import { parseCpu } from 'components/Lambdas/helpers/resources';
import { schema, inputNames } from './shared';

import './ResourceManagement.scss';

export default function ResourcesManagement({ lambda }) {
  const defaultValues = {
    [inputNames.replicas.min]: lambda.replicas.min || '1',
    [inputNames.replicas.max]: lambda.replicas.max || '1',
    [inputNames.requests.cpu]: parseCpu(lambda.resources.requests.cpu || ''),
    [inputNames.limits.cpu]: parseCpu(lambda.resources.limits.cpu || ''),
    [inputNames.requests.memory]: lambda.resources.requests.memory || '',
    [inputNames.limits.memory]: lambda.resources.limits.memory || '',
  };

  const {
    register,
    handleSubmit,
    errors,
    formState,
    setValue,
    triggerValidation,
  } = useForm({
    validationSchema: schema,
    mode: 'onChange',
    defaultValues,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const updateLambda = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.RESOURCES_AND_REPLICAS,
  });

  function resetFields() {
    Object.entries(defaultValues).forEach(([name, val]) => setValue(name, val));
  }

  async function retriggerValidation() {
    await Promise.all(
      Object.keys(defaultValues).map(elem => triggerValidation(elem)),
    );
  }

  function onSubmit(data) {
    const callback = ({ ok }) => {
      if (!ok) {
        resetFields();
      }
    };

    if (!isEditMode) {
      updateLambda(
        {
          replicas: { min: data.minReplicas, max: data.maxReplicas },
          resources: {
            requests: {
              cpu: data.requestsCpu,
              memory: data.requestsMemory,
            },
            limits: {
              cpu: data.limitsCpu,
              memory: data.limitsMemory,
            },
          },
        },
        callback,
      );
    }
  }

  const saveText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.SAVE;
  const editText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.EDIT;

  return (
    <Panel className="fd-has-margin-m lambda-resources-management">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Panel.Header className="fd-has-padding-xs">
          <Panel.Head title={RESOURCES_MANAGEMENT_PANEL.TITLE} />
          <Panel.Actions>
            {isEditMode && (
              <Button
                glyph="sys-cancel"
                type="negative"
                onClick={async () => {
                  resetFields();
                  setIsEditMode(false);
                  retriggerValidation();
                }}
              >
                {BUTTONS.CANCEL}
              </Button>
            )}
            <Button
              glyph={isEditMode ? 'save' : 'edit'}
              option={isEditMode ? 'emphasized' : 'light'}
              typeAttr="submit"
              onClick={async () => {
                // this needs to be here and not in `onSumbit`,
                //because we need to be able to turn on edit Mode when underlying data does not pass validation
                setIsEditMode(prev => !prev);
                await retriggerValidation();
              }}
              disabled={isEditMode && !formState.isValid}
            >
              {isEditMode ? saveText : editText}
            </Button>
          </Panel.Actions>
        </Panel.Header>
        <Panel.Body className="fd-has-padding-xs">
          <LambdaReplicas
            register={register}
            disabledForm={!isEditMode}
            errors={errors}
          />
        </Panel.Body>
        <Panel.Body className="fd-has-padding-xs">
          <LambdaResources
            register={register}
            disabledForm={!isEditMode}
            errors={errors}
          />
        </Panel.Body>
      </form>
    </Panel>
  );
}
