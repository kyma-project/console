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

const cpuRegexp = /(^\d+(\.\d+)?$)|(^\d+[m]$)/;
const memoryRegexp = /^\d+(\.\d+)?(Gi|Mi|Ki)$/;

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

  const { register, handleSubmit, errors, formState, setValue } = useForm({
    validationSchema: schema,
    mode: 'onChange',
    defaultValues: {
      [inputNames.replicas.min]: defaultedReplicas.min,
      [inputNames.replicas.max]: defaultedReplicas.max,
      [inputNames.requests.cpu]: defaultedResources.requests.cpu,
      [inputNames.limits.cpu]: defaultedResources.limits.cpu,
      [inputNames.requests.memory]: defaultedResources.requests.memory,
      [inputNames.limits.memory]: defaultedResources.limits.memory,
    },
  });

  const [disabledForm, setDisabledForm] = useState(true);
  const updateLambda = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.RESOURCES_AND_REPLICAS,
  });

  const resetFields = () => {
    setValue(inputNames.replicas.min, defaultedReplicas.min);
    setValue([inputNames.replicas.min], defaultedReplicas.min);
    setValue([inputNames.replicas.max], defaultedReplicas.max);
    setValue([inputNames.requests.cpu], defaultedResources.requests.cpu);
    setValue([inputNames.limits.cpu], defaultedResources.limits.cpu);
    setValue([inputNames.requests.memory], defaultedResources.requests.memory);
    setValue([inputNames.limits.memory], defaultedResources.limits.memory);
  };

  const onSubmit = data => {
    const callback = ({ ok }) => {
      if (!ok) {
        resetFields();
      }
    };

    setDisabledForm(prev => !prev);

    if (!disabledForm) {
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
  return (
    <Panel className="fd-has-margin-m lambda-resources-management">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Panel.Header className="fd-has-padding-xs">
          <Panel.Head title={RESOURCES_MANAGEMENT_PANEL.TITLE} />
          <Panel.Actions>
            {!disabledForm && (
              <Button
                glyph="sys-cancel"
                type="negative"
                onClick={() => {
                  resetFields();
                  setDisabledForm(true);
                }}
              >
                {'Cancel'}
              </Button>
            )}
            <Button
              glyph={disabledForm ? 'edit' : 'save'}
              option={disabledForm ? 'light' : 'default'}
              typeAttr="submit"
              disabled={!formState.isValid}
            >
              {disabledForm ? editText : saveText}
            </Button>
          </Panel.Actions>
        </Panel.Header>
        <Panel.Body className="fd-has-padding-xs">
          <LambdaReplicas
            register={register}
            disabledForm={disabledForm}
            errors={errors}
          />
        </Panel.Body>
        <Panel.Body className="fd-has-padding-xs">
          <LambdaResources
            register={register}
            disabledForm={disabledForm}
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
