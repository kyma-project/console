import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormItem, FormLabel } from 'fundamental-react';
import { useMutation } from '@apollo/react-hooks';
import * as LuigiClient from '@kyma-project/luigi-client';

import SchemaData from './SchemaData.component';
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
  jsonSchemaFormRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  item: PropTypes.object,

  checkInstanceExistQuery: PropTypes.object.isRequired,
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
  formElementRefAdditional,
  item,
  checkInstanceExistQuery,
}) {
  const plans = (item && item.plans) || [];
  plans.forEach(plan => {
    parseDefaultIntegerValues(plan);
  });
  const [name, setName] = useState(
    `${item.externalName}-${randomNameGenerator()}` || randomNameGenerator(),
  );
  const plan = plans[0].name;
  const [instanceCreateParameters, setInstanceCreateParameters] = useState({});
  const [instanceCreateParameterSchema] = useState(
    getInstanceCreateParameterSchema(plans, plan),
  );
  const [instanceCreateParameterSchemaExists] = useState(
    instanceCreateParameterSchema &&
      (instanceCreateParameterSchema.$ref ||
        instanceCreateParameterSchema.properties),
  );
  const formValues = {
    name: useRef(
      `${item.externalName}-${randomNameGenerator()}` || randomNameGenerator(),
    ),
    plan: useRef(plan),
    labels: useRef(null),
  };

  const [createInstance] = useMutation(createServiceInstance);

  const instanceAlreadyExists = name => {
    return checkInstanceExistQuery.serviceInstances
      .map(instance => instance.name)
      .includes(name);
  };

  const onFormChange = formEvent => {
    formValues.name.current.setCustomValidity(
      instanceAlreadyExists(formValues.name.current.value)
        ? 'Instance with this name already exists.'
        : '',
    );

    onChange(formEvent);
  };
  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const currentPlan =
        plans.find(e => e.name === formValues.plan.current.value) ||
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

      await createInstance({
        variables,
      });
      onCompleted(variables.name, `Instance created succesfully`);
      LuigiClient.linkManager()
        .fromContext('namespaces')
        .navigate(`cmf-instances/details/${variables.name}`);
    } catch (e) {
      onError(`The instance could not be created succesfully`, e.message || ``);
    }
  }

  return (
    <>
      <form
        ref={formElementRef}
        style={{ width: '47em' }}
        onChange={onFormChange}
        onLoad={onFormChange}
        onSubmit={handleFormSubmit}
      >
        <FormItem>
          <div className="grid-wrapper">
            <div className="column">
              <FormLabel htmlFor="instanceName">Name*</FormLabel>
              <input
                className="fd-form__control"
                ref={formValues.name}
                defaultValue={name}
                onChange={e => setName(e.target.value)}
                type="text"
                id="instanceName"
                placeholder={'Instance name'}
                aria-required="true"
                required
                pattern="^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$"
                autoComplete="off"
              />
            </div>
            <div className="column">
              <FormLabel htmlFor="plan">Plan*</FormLabel>
              <select id="plan" ref={formValues.plan} defaultValue={plans[0]}>
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
      </form>

      {instanceCreateParameterSchemaExists && (
        <>
          <div className="separator" />
          <SchemaData
            formRef={formElementRefAdditional}
            data={instanceCreateParameters}
            instanceCreateParameterSchema={instanceCreateParameterSchema}
            planName={
              formValues.plan &&
              formValues.plan.current &&
              formValues.plan.current.value
            }
            onSubmitSchemaForm={() => {}}
            callback={(formData, errors) => {
              onChange(formData);
              setInstanceCreateParameters(formData.instanceCreateParameters);
            }}
          />
        </>
      )}
    </>
  );
}
