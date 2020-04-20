import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Panel, Button } from 'fundamental-react';
import { RESOURCES_MANAGEMENT_PANEL } from 'components/Lambdas/constants';
import { useUpdateLambda, UPDATE_TYPE } from 'components/Lambdas/gql/hooks';
import { LambdaReplicas } from './LambdaReplicas';
import { LambdaResources } from './LambdaResources';
import './ResourceManagement.scss';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const cpuRegexp = /(^\d+(\.\d+)?$)|(^\d+[m]$)/;
const memoryRegexp = /^\d+(\.\d+)?(Gi|Mi|Ki|G|M|K)?$/;

const schema = yup.object().shape({
  minReplicas: yup
    .number()
    .min(0)
    .integer()
    .test(
      'match',
      'Minimum number of replicas has to be equal to or lower than maximum',
      function(arg) {
        return arg <= this.parent.maxReplicas;
      },
    ),
  maxReplicas: yup
    .number()
    .min(0)
    .integer()
    .test(
      'match',
      'Maximum number of replicas has to be equal or greater than minimum',
      function(arg) {
        return arg >= this.parent.minReplicas;
      },
    ),
  requestsCpu: yup
    .string()
    .matches(cpuRegexp, { excludeEmptyString: true, message: 'XD' }),
  limitsCpu: yup.string().matches(cpuRegexp, { excludeEmptyString: true }),
  requestsMemory: yup
    .string()
    .matches(memoryRegexp, { excludeEmptyString: true }),
  limitsMemory: yup
    .string()
    .matches(memoryRegexp, { excludeEmptyString: true }),
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

  const { register, handleSubmit, errors, formState, reset } = useForm({
    validationSchema: schema,
    mode: 'onChange',
    defaultValues: {
      minReplicas: defaultedReplicas.min,
      maxReplicas: defaultedReplicas.max,
      requestsCpu: defaultedResources.requests.cpu,
      limitsCpu: defaultedResources.limits.cpu,
      requestsMemory: defaultedResources.requests.memory,
      limitsMemory: defaultedResources.limits.memory,
    },
  });

  const [disabledForm, setDisabledForm] = useState(true);
  const updateLambda = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.RESOURCES_AND_REPLICAS,
  });

  const onSubmit = data => {
    const callback = ({ ok }) => {
      if (!ok) {
        reset();
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
                  reset();
                  setDisabledForm(true);
                }}
              >
                {'Cancel'}
              </Button>
            )}
            <Button
              glyph={disabledForm ? 'edit' : 'save'}
              option={disabledForm ? 'light' : 'emphasized'}
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
