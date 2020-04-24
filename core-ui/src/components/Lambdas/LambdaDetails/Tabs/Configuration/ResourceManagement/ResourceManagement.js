import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Panel, Button } from 'fundamental-react';
import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';
import { useUpdateLambda, UPDATE_TYPE } from 'components/Lambdas/gql/hooks';
import { LambdaReplicas } from './LambdaReplicas';
import { LambdaResources } from './LambdaResources';
import './ResourceManagement.scss';
import { inputNames } from './shared';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export const cpuRegexp = /^\d+(\.\d+)?m?$/;
export const memoryRegexp = /^\d+(\.\d+)?(Gi|Mi|Ki|G|M|K)$/;

const schema = yup.object().shape({
  [inputNames.replicas.min]: yup
    .number()
    .transform((val, originalVal) => {
      return originalVal === '' ? -1 : val; // -1 so that instead of throwing errors about NaN it will pass validation here, but fail on min(0) with nicer error message
    })
    .min(0, RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MIN_REPLICAS_NON_NEGATIVE)
    .integer(
      RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MIN_REPLICAS_NON_NEGATIVE,
    )
    .test(
      'matchMinReplicas',
      RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MIN_REPLICAS_TOO_HIGH,
      function(arg) {
        return arg <= this.parent.maxReplicas;
      },
    ),
  [inputNames.replicas.max]: yup
    .number()
    .transform((val, originalVal) => {
      return originalVal === '' ? -1 : val; // -1 so that instead of throwing errors about NaN it will pass validation here, but fail on min(0) with nicer error message
    })
    .min(0, RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MAX_REPLICAS_NON_NEGATIVE)
    .integer(
      RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MAX_REPLICAS_NON_NEGATIVE,
    )
    .test(
      'matchMaxReplicas',
      RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MAX_REPLICAS_TOO_LOW,
      function(arg) {
        return arg >= this.parent.minReplicas;
      },
    ),
  [inputNames.requests.cpu]: yup.string().matches(cpuRegexp, {
    excludeEmptyString: true,
    message: RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.CPU,
  }),
  [inputNames.limits.cpu]: yup.string().matches(cpuRegexp, {
    excludeEmptyString: true,
    message: RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.CPU,
  }),
  [inputNames.requests.memory]: yup.string().matches(memoryRegexp, {
    excludeEmptyString: true,
    message: RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MEMORY,
  }),
  [inputNames.limits.memory]: yup.string().matches(memoryRegexp, {
    excludeEmptyString: true,
    message: RESOURCES_MANAGEMENT_PANEL.ERROR_MESSAGES.MEMORY,
  }),
});

export function ResourcesManagement({ lambda }) {
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

  const resetFields = () =>
    Object.entries(defaultValues).forEach(([name, val]) => setValue(name, val));

  const retriggerValidation = async () => {
    await Promise.all(
      Object.keys(defaultValues).map(elem => triggerValidation(elem)),
    );
  };

  const onSubmit = data => {
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
  };

  const saveText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.SAVE;
  const editText = RESOURCES_MANAGEMENT_PANEL.EDIT_MODAL.OPEN_BUTTON.TEXT.EDIT;

  console.log(isEditMode, formState.isValid);

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
                {'Cancel'}
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

ResourcesManagement.propTypes = {
  lambda: PropTypes.object.isRequired,
};

export const parseCpu = cpu => {
  const microCpuRegexp = /^\d+(\.\d+)?u$/;
  const nanoCpuRegexp = /^\d+(\.\d+)?n$/;
  if (microCpuRegexp.test(cpu)) {
    const numberPart = parseFloat(cpu.slice(0, cpu.length - 1));
    return `${numberPart / 1000}m`;
  }
  if (nanoCpuRegexp.test(cpu)) {
    const numberPart = parseFloat(cpu.slice(0, cpu.length - 1));
    return `${numberPart / 10 ** 6}m`;
  }
  return cpu;
};
