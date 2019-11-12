import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormItem, FormLabel } from 'fundamental-react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import * as LuigiClient from '@kyma-project/luigi-client';

import SchemaData from './SchemaData.component';
import builder from '../../../commons/builder';
import { checkInstanceExist } from './queries';
import { createServiceInstance } from './mutations';

import './CreateInstanceModal.scss';
import {
  getResourceDisplayName,
  randomNameGenerator,
} from '../../../commons/helpers';

CreateInstanceModal.propTypes = {
  onChange: PropTypes.func,
  onCompleted: PropTypes.func,
  onError: PropTypes.func,
  formElementRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  item: PropTypes.object,
};

const parseDefaultIntegerValues = plan => {
  const schema = (plan && plan.instanceCreateParameterSchema) || null;
  if (schema && schema.properties) {
    const schemaProps = schema.properties;
    Object.keys(schemaProps).forEach(key => {
      if (
        schemaProps[key].default !== undefined &&
        schemaProps[key].type === 'integer'
      ) {
        schemaProps[key].default = Number(schemaProps[key].default);
      }
    });
  }
};

const getInstanceCreateParameterSchema = (plans, currentPlan) => {
  const schema = plans.find(e => e.name === currentPlan) || plans[0].name;

  return (schema && schema.instanceCreateParameterSchema) || {};
};
export default function CreateInstanceModal({
  onChange,
  onCompleted,
  onError,
  formElementRef,
  item,
}) {
  const plans = (item && item.plans) || [];
  plans.forEach(plan => {
    parseDefaultIntegerValues(plan);
  });
  const [name, setName] = useState(
    `${item.externalName}-${randomNameGenerator()}` || randomNameGenerator(),
  );
  const [plan, setPlan] = useState(plans[0].name);
  const [instanceCreateParameters, setInstanceCreateParameters] = useState({});
  const [existingInstance, setExistingInstance] = useState('');
  const [instanceCreateParameterSchema] = useState(
    getInstanceCreateParameterSchema(plans, plan),
  );
  const [instanceCreateParameterSchemaExists] = useState(
    instanceCreateParameterSchema &&
      (instanceCreateParameterSchema.$ref ||
        instanceCreateParameterSchema.properties),
  );

  console.log('instanceCreateParameters', instanceCreateParameters);

  const formValues = {
    validName: useRef(false),
    plan: useRef(plan),
    labels: useRef(null),
  };

  const [createInstance] = useMutation(createServiceInstance);
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(checkInstanceExist, {
    variables: {
      namespace: builder.getCurrentEnvironmentId(),
      name: name,
    },
  });

  useEffect(() => {
    if (name) {
      refetch({
        namespace: builder.getCurrentEnvironmentId(),
        name: name,
      });
    }
  }, [name]);

  useEffect(() => {
    if (formElementRef && formElementRef.current) {
      formElementRef.current.checkValidity();
      console.log(
        'formElementRef2',
        formElementRef.current[1].checkValidity(),
        formElementRef.current[1],
        formElementRef.current.reportValidity(),
        formElementRef,
        'formValues',
        formValues,
      );
    }
  }, [formElementRef]);

  useEffect(() => {
    if (queryData && !queryLoading && !queryError) {
      const instanceName = document.getElementById('instanceName');
      const validName = document.getElementById('validName');
      if (queryData.serviceInstance && queryData.serviceInstance.name) {
        setExistingInstance(queryData.serviceInstance.name);
        instanceName.classList.add('is-invalid');
        validName.checked = false;
      } else {
        setExistingInstance('');
        instanceName.classList.remove('is-invalid');
        validName.checked = true;
      }
      console.log('existingInstance', existingInstance, 'queryData', queryData);
    }
  }, [queryData, queryLoading, queryError]);

  console.log('formValues', formValues);

  async function handleFormSubmit(e) {
    try {
      const currentPlan =
        plans.find(e => e.name === formValues.plan) ||
        (plans.length && plans[0]);
      const labels =
        formValues.labels.current.value === ''
          ? []
          : formValues.labels.current.value
              .replace(/\s+/g, '')
              .toLowerCase()
              .split(',');
      const isClusterServiceClass = item.__typename === 'ClusterServiceClass';
      const variables = {
        name,
        namespace: LuigiClient.getEventData().environmentId,
        externalServiceClassName: item.externalName,
        externalPlanName: currentPlan && currentPlan.externalName,
        classClusterWide: isClusterServiceClass,
        planClusterWide: isClusterServiceClass,
        labels,
        parameterSchema: instanceCreateParameters,
      };

      console.log('variables', variables);
      // await createInstance({
      //     variables,
      // });
      onCompleted(variables.name, `Instance created succesfully`);
      LuigiClient.linkManager()
        .fromContext('namespaces')
        .navigate(`cmf-instances/details/${variables.name}`);
    } catch (e) {
      onError(`The lambda could not be created succesfully`, e.message || ``);
    }
  }

  return (
    <form
      ref={formElementRef}
      style={{ width: '47em' }}
      onChange={onChange}
      onLoad={onChange}
      onSubmit={handleFormSubmit}
    >
      <FormItem>
        <div className="grid-wrapper">
          <div className="column">
            <FormLabel htmlFor="instanceName">Name*</FormLabel>
            <input
              className="fd-form__control"
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
              id="instanceName"
              placeholder={'Instance name'}
              aria-required="true"
              required
              pattern="^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$"
            />
            <input
              className="fd-form__control"
              ref={formValues.validName}
              type="checkbox"
              id="validName"
              required
            />
          </div>
          <div className="column">
            <FormLabel htmlFor="plan">Plan*</FormLabel>
            <select
              id="plan"
              ref={formValues.plan}
              defaultValue={plans[0]}
              onChange={e => {
                console.log('dd', e.target.value);
                setPlan(e.target.value);
              }}
            >
              {plans.map((p, i) => (
                <option key={['plan', i].join('_')} value={p.name}>
                  {getResourceDisplayName(p)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormItem>
      <FormItem>
        <FormLabel htmlFor="labels">Labels</FormLabel>
        <input
          className="fd-form__control"
          ref={formValues.labels}
          type="text"
          id="labels"
          placeholder={'Separate labels with comma'}
          aria-required="false"
          pattern="^[a-z0-9]([a-z0-9]*)?(,\s?[a-z0-9]+)*$"
        />
      </FormItem>

      {instanceCreateParameterSchemaExists && (
        <>
          <div className="separator" />

          <SchemaData
            data={instanceCreateParameters}
            instanceCreateParameterSchema={instanceCreateParameterSchema}
            onSubmitSchemaForm={(formData, errors) =>
              console.log(
                'onSubmitSchemaForm formData',
                formData,
                'errors',
                errors,
              )
            }
            planName={plan}
            callback={(formData, errors) => {
              console.log('callback formData', formData, 'errors', errors);
              setInstanceCreateParameters(formData.instanceCreateParameters);
            }}
          />
        </>
      )}
    </form>
  );
}
