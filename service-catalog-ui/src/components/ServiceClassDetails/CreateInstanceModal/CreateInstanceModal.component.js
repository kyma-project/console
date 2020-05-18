import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormItem, FormLabel, Icon } from 'fundamental-react';
import { useMutation } from '@apollo/react-hooks';
import * as LuigiClient from '@kyma-project/luigi-client';

import SchemaData from './SchemaData.component';
import { createServiceInstance } from './mutations';

import './CreateInstanceModal.scss';
import { getResourceDisplayName, randomNameGenerator } from 'helpers';

import {
  CustomPropTypes,
  JSONEditor,
  Tooltip,
  CopiableLink,
} from 'react-shared';

const SERVICE_PLAN_SHAPE = PropTypes.shape({
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
});

CreateInstanceModal.propTypes = {
  onChange: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  formElementRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  jsonSchemaFormRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  item: PropTypes.object,

  checkInstanceExistQuery: PropTypes.object.isRequired,
  preselectedPlan: SERVICE_PLAN_SHAPE,
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

const PlanColumnContent = ({
  preselectedPlan,
  defaultPlan,
  onPlanChange,
  dropdownRef,
  allPlans,
}) => {
  if (preselectedPlan)
    return (
      <>
        <FormLabel htmlFor="plan">Plan (preselected)</FormLabel>
        <p className="fd-has-font-weight-light">
          {preselectedPlan.displayName}
        </p>
      </>
    );
  else
    return (
      <>
        <FormLabel required htmlFor="plan">
          Plan
        </FormLabel>
        <select
          id="plan"
          aria-label="plan-selector"
          ref={dropdownRef}
          defaultValue={defaultPlan}
          onChange={onPlanChange}
        >
          {allPlans.map((p, i) => (
            <option key={['plan', i].join('_')} value={p.name}>
              {getResourceDisplayName(p)}
            </option>
          ))}
        </select>
      </>
    );
};

PlanColumnContent.proTypes = {
  preselectedPlan: SERVICE_PLAN_SHAPE,
  defaultPlan: SERVICE_PLAN_SHAPE,
  onPlanChange: PropTypes.func.isRequired,
  dropdownRef: CustomPropTypes.ref.isRequired,
  allPlans: PropTypes.arrayOf(SERVICE_PLAN_SHAPE),
};

export default function CreateInstanceModal({
  onCompleted,
  onChange,
  onError,
  setCustomValid,
  formElementRef,
  jsonSchemaFormRef,
  item,
  checkInstanceExistQuery,
  preselectedPlan,
  documentationUrl,
}) {
  const [
    customParametersProvided,
    setCustomParametersProvided,
  ] = React.useState(false);
  const plans = (item && item.plans) || [];
  plans.forEach(plan => {
    parseDefaultIntegerValues(plan);
  });
  const defaultName =
    `${item.externalName}-${randomNameGenerator()}` || randomNameGenerator();
  const plan = preselectedPlan ? preselectedPlan.name : plans[0].name;

  const [instanceCreateParameters, setInstanceCreateParameters] = useState({});
  const [validationVisible, setValidationVisible] = useState(false);
  const [
    instanceCreateParameterSchema,
    setInstanceCreateParameterSchema,
  ] = useState(getInstanceCreateParameterSchema(plans, plan));

  const instanceCreateParameterSchemaExists =
    instanceCreateParameterSchema &&
    (instanceCreateParameterSchema.$ref ||
      instanceCreateParameterSchema.properties);
  const formValues = {
    name: useRef(null),
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
  const handlePlanChange = e => {
    const newParametersSchema = getInstanceCreateParameterSchema(
      plans,
      e.target.value,
    );
    setValidationVisible(false);
    setInstanceCreateParameterSchema(newParametersSchema);
    setInstanceCreateParameters({});
    if (!newParametersSchema || !newParametersSchema.length) {
      jsonSchemaFormRef.current = null;
    }
  };

  const handleCustomParametersChange = input => {
    const isNonNullObject = o => typeof o === 'object' && !!o;
    try {
      const parsedInput = JSON.parse(input);
      if (isNonNullObject(parsedInput)) {
        setInstanceCreateParameters(parsedInput);
        setCustomValid(true);
      }
    } catch (_) {
      setCustomValid(false);
    }
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const currentPlan =
        preselectedPlan ||
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
        name: formValues.name.current.value,
        namespace: LuigiClient.getContext().namespaceId,
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
        id="createInstanceForm"
      >
        <FormItem>
          <div className="grid-wrapper">
            <div className="column">
              <FormLabel htmlFor="instanceName">Name*</FormLabel>
              <input
                className="fd-form__control"
                ref={formValues.name}
                defaultValue={defaultName}
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
              <PlanColumnContent
                preselectedPlan={preselectedPlan}
                defaultPlan={plan}
                onPlanChange={handlePlanChange}
                dropdownRef={formValues.plan}
                allPlans={plans}
              />
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
      <div className="instance-schema-panel__separator" />
      {instanceCreateParameterSchemaExists && (
        <SchemaData
          validationVisible={validationVisible}
          schemaFormRef={jsonSchemaFormRef}
          data={instanceCreateParameters}
          instanceCreateParameterSchema={instanceCreateParameterSchema}
          planName={
            (formValues.plan &&
              formValues.plan.current &&
              formValues.plan.current.value) ||
            ''
          }
          onSubmitSchemaForm={() => {}}
          onFormChange={formData => {
            if (
              !validationVisible &&
              Object.values(formData.instanceCreateParameters).some(
                val => val !== undefined,
              )
            )
              setValidationVisible(true); // validation is hidden but some input has been performed => show validation

            onChange(formData);
            setInstanceCreateParameters(formData.instanceCreateParameters);
          }}
        />
      )}

      {!instanceCreateParameterSchemaExists && (
        <>
          <div className="fd-has-margin-top-s fd-has-margin-bottom-tiny instance-schema-panel">
            <div>
              <span
                className="link fd-has-margin-right-tiny clear-underline"
                onClick={() =>
                  setCustomParametersProvided(!customParametersProvided)
                }
              >
                {customParametersProvided
                  ? 'Remove parameters'
                  : 'Add parameters'}
              </span>
              <Tooltip
                position="top"
                title="The service provider did not define specific parameters for the selected plan. Refer to the documentation to learn about the required parameters, and define them as JSON in the editor."
              >
                <Icon glyph="sys-help" />
              </Tooltip>
            </div>
            {documentationUrl && (
              <CopiableLink url={documentationUrl} text="Documentation" />
            )}
          </div>
          {customParametersProvided && (
            <JSONEditor
              aria-label="schema-editor"
              onChangeText={handleCustomParametersChange}
              text={JSON.stringify(instanceCreateParameters, null, 2)}
            />
          )}
        </>
      )}
    </>
  );
}
