import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Panel, Button } from 'fundamental-react';
import { Tooltip } from 'react-shared';

import LambdaReplicas from './LambdaReplicas';
import LambdaResources from './LambdaResources';

import {
  useUpdateLambda,
  UPDATE_TYPE,
} from 'components/Lambdas/gql/hooks/mutations/useUpdateLambda';
import {
  BUTTONS,
  RESOURCES_MANAGEMENT_PANEL,
} from 'components/Lambdas/constants';
import { parseCpu } from 'components/Lambdas/helpers/resources';
import { CONFIG } from 'components/Lambdas/config';
import {
  schema,
  inputNames,
  checkReplicasPreset,
  checkResourcesPreset,
} from './shared';

import './ResourceManagement.scss';

const saveText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.SAVE;
const editText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.EDIT;
const popupMessage =
  RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.CONFIRM_BUTTON.POPUP_MESSAGE;

function getDefaultFormValues(lambda) {
  return {
    [inputNames.replicas.preset]: checkReplicasPreset(
      lambda.spec.minReplicas,
      lambda.spec.maxReplicas,
      CONFIG.functionReplicasPresets,
    ),
    [inputNames.replicas.min]:
      lambda.spec.minReplicas || CONFIG.functionMinReplicas,
    [inputNames.replicas.max]:
      lambda.spec.maxReplicas || CONFIG.functionMinReplicas,

    [inputNames.function.preset]: checkResourcesPreset(
      lambda.spec.resources,
      CONFIG.functionResourcesPresets,
    ),
    [inputNames.function.requests.cpu]: parseCpu(
      lambda.spec.resources.requests.cpu || '',
    ),
    [inputNames.function.limits.cpu]: parseCpu(
      lambda.spec.resources.limits.cpu || '',
    ),
    [inputNames.function.requests.memory]:
      lambda.spec.resources.requests.memory || '',
    [inputNames.function.limits.memory]:
      lambda.spec.resources.limits.memory || '',

    [inputNames.buildJob.preset]: checkResourcesPreset(
      lambda.spec.buildResources,
      CONFIG.buildJobResourcesPresets,
    ),
    [inputNames.buildJob.requests.cpu]: parseCpu(
      lambda.spec.buildResources.requests.cpu || '',
    ),
    [inputNames.buildJob.limits.cpu]: parseCpu(
      lambda.spec.buildResources.limits.cpu || '',
    ),
    [inputNames.buildJob.requests.memory]:
      lambda.spec.buildResources.requests.memory || '',
    [inputNames.buildJob.limits.memory]:
      lambda.spec.buildResources.limits.memory || '',
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
          ...lambda,
          spec: {
            ...lambda.spec,
            minReplicas: data.minReplicas,
            maxReplicas: data.maxReplicas,
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
        <div className="lambda-resources-management__panel">
          <Panel.Header className="fd-has-padding-xs">
            <Panel.Head title={RESOURCES_MANAGEMENT_PANEL.REPLICAS.TITLE} />
          </Panel.Header>
          <Panel.Body className="fd-has-padding-xs">
            <LambdaReplicas
              register={register}
              disabledForm={!isEditMode}
              errors={errors}
              triggerValidation={triggerValidation}
              retriggerValidation={retriggerValidation}
            />
          </Panel.Body>
        </div>
        <div className="lambda-resources-management__panel">
          <Panel.Header className="fd-has-padding-xs">
            <Panel.Head
              title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.TYPES.FUNCTION.TITLE}
              description={
                RESOURCES_MANAGEMENT_PANEL.RESOURCES.TYPES.FUNCTION.DESCRIPTION
              }
            />
          </Panel.Header>
          <Panel.Body className="fd-has-padding-xs">
            <LambdaResources
              register={register}
              disabledForm={!isEditMode}
              errors={errors}
              triggerValidation={triggerValidation}
              retriggerValidation={retriggerValidation}
              setValue={setValue}
              type="function"
              defaultPreset={defaultValues[inputNames.function.preset]}
            />
          </Panel.Body>
        </div>
        <div className="lambda-resources-management__panel">
          <Panel.Header className="fd-has-padding-xs">
            <Panel.Head
              title={RESOURCES_MANAGEMENT_PANEL.RESOURCES.TYPES.BUILD_JOB.TITLE}
              description={
                RESOURCES_MANAGEMENT_PANEL.RESOURCES.TYPES.BUILD_JOB.DESCRIPTION
              }
            />
          </Panel.Header>
          <Panel.Body className="fd-has-padding-xs">
            <LambdaResources
              register={register}
              disabledForm={!isEditMode}
              errors={errors}
              triggerValidation={triggerValidation}
              retriggerValidation={retriggerValidation}
              setValue={setValue}
              type="buildJob"
              defaultPreset={defaultValues[inputNames.buildJob.preset]}
            />
          </Panel.Body>
        </div>
      </form>
    </Panel>
  );
}
