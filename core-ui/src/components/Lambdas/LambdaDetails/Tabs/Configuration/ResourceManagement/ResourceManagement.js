import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Panel, Button } from 'fundamental-react';
import { Tooltip } from 'react-shared';

import LambdaReplicas from './LambdaReplicas';
import {
  LambdaFunctionResources,
  LambdaBuildResources,
} from './LambdaResources';

import {
  useUpdateLambda,
  UPDATE_TYPE,
} from 'components/Lambdas/gql/hooks/mutations/useUpdateLambda';
import {
  BUTTONS,
  RESOURCES_MANAGEMENT_PANEL,
} from 'components/Lambdas/constants';
import { parseCpu } from 'components/Lambdas/helpers/resources';
import { schema, inputNames } from './shared';

import './ResourceManagement.scss';

const saveText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.SAVE;
const editText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.EDIT;
const popupMessage =
  RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.CONFIRM_BUTTON.POPUP_MESSAGE;

function getDefaultFormValues(lambda) {
  return {
    [inputNames.replicas.min]: lambda.replicas.min || '1',
    [inputNames.replicas.max]: lambda.replicas.max || '1',
    [inputNames.functionResources.requests.cpu]: parseCpu(
      lambda.resources.requests.cpu || '',
    ),
    [inputNames.functionResources.limits.cpu]: parseCpu(
      lambda.resources.limits.cpu || '',
    ),
    [inputNames.functionResources.requests.memory]:
      lambda.resources.requests.memory || '',
    [inputNames.functionResources.limits.memory]:
      lambda.resources.limits.memory || '',

    [inputNames.buildResources.requests.cpu]: parseCpu(
      lambda.buildResources.requests.cpu || '',
    ),
    [inputNames.buildResources.limits.cpu]: parseCpu(
      lambda.buildResources.limits.cpu || '',
    ),
    [inputNames.buildResources.requests.memory]:
      lambda.buildResources.requests.memory || '',
    [inputNames.buildResources.limits.memory]:
      lambda.buildResources.limits.memory || '',
  };
}

export default function ResourcesManagement({ lambda }) {
  const defaultValues = getDefaultFormValues(lambda);

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

  useEffect(() => {
    if (!isEditMode) {
      updateFields(getDefaultFormValues(lambda));
    }
    // it is intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lambda]);

  function updateFields(data) {
    Object.entries(data).forEach(
      ([name, val]) => setValue && setValue(name, val),
    );
  }

  async function retriggerValidation() {
    await Promise.all(
      Object.keys(defaultValues).map(elem => triggerValidation(elem)),
    );
  }

  async function onSubmit(data) {
    const callback = ({ ok }) => {
      if (!ok) {
        updateFields(defaultValues);
      }
    };

    if (!isEditMode) {
      updateLambda(
        {
          replicas: { min: data.minReplicas, max: data.maxReplicas },
          resources: {
            requests: {
              cpu: data.functionRequestsCpu,
              memory: data.functionRequestsMemory,
            },
            limits: {
              cpu: data.functionLimitsCpu,
              memory: data.functionLimitsMemory,
            },
          },
          buildResources: {
            requests: {
              cpu: data.buildRequestsCpu,
              memory: data.buildRequestsMemory,
            },
            limits: {
              cpu: data.buildLimitsCpu,
              memory: data.buildLimitsMemory,
            },
          },
        },
        callback,
      );
    }
  }

  function renderCancelButton() {
    if (!isEditMode) {
      return null;
    }

    return (
      <Button
        glyph="sys-cancel"
        type="negative"
        onClick={async () => {
          updateFields(defaultValues);
          setIsEditMode(false);
          retriggerValidation();
        }}
      >
        {BUTTONS.CANCEL}
      </Button>
    );
  }

  function renderConfirmButton() {
    const disabled = isEditMode && !formState.isValid;
    const button = (
      <Button
        glyph={isEditMode ? 'save' : 'edit'}
        option={isEditMode ? 'emphasized' : 'light'}
        typeAttr="submit"
        onClick={() => setIsEditMode(prev => !prev)}
        disabled={isEditMode && !formState.isValid}
      >
        {isEditMode ? saveText : editText}
      </Button>
    );

    if (disabled) {
      return (
        <Tooltip
          content={popupMessage}
          position="top"
          trigger="mouseenter"
          tippyProps={{
            distance: 16,
          }}
        >
          {button}
        </Tooltip>
      );
    }
    return button;
  }

  return (
    <Panel className="fd-has-margin-m lambda-resources-management">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Panel.Header className="fd-has-padding-xs">
          <Panel.Head title={RESOURCES_MANAGEMENT_PANEL.TITLE} />
          <Panel.Actions>
            {renderCancelButton()}
            {renderConfirmButton()}
          </Panel.Actions>
        </Panel.Header>
        <Panel.Body className="fd-has-padding-xs">
          <LambdaReplicas
            register={register}
            disabledForm={!isEditMode}
            errors={errors}
            triggerValidation={triggerValidation}
          />
        </Panel.Body>
        <Panel.Body className="fd-has-padding-xs">
          <LambdaFunctionResources
            register={register}
            disabledForm={!isEditMode}
            errors={errors}
            triggerValidation={triggerValidation}
          />
        </Panel.Body>
        <Panel.Body className="fd-has-padding-xs">
          <LambdaBuildResources
            register={register}
            disabledForm={!isEditMode}
            errors={errors}
            triggerValidation={triggerValidation}
          />
        </Panel.Body>
      </form>
    </Panel>
  );
}
