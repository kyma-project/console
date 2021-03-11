import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormItem, FormLabel, Icon, InlineHelp, Link } from 'fundamental-react';
import { useMutation } from '@apollo/react-hooks';
import * as LuigiClient from '@luigi-project/client';

import SchemaData from './SchemaData.component';
import { createServiceInstance } from './mutations';

import './CreateInstanceModal.scss';
import { getResourceDisplayName, randomNameGenerator } from 'helpers';
import { usePost, useNotification } from 'react-shared';

import {
  CustomPropTypes,
  JSONEditor,
  Tooltip,
  CopiableLink,
} from 'react-shared';

import { createInstanceInput } from './CreateInstanceInput.js';
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
};

const parseDefaultIntegerValues = plan => {
  const schema = plan.spec.instanceCreateParameterSchema || null;
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
  const schema =
    plans?.find(e => e.metadata.name === currentPlan) || plans[0]?.name;
  return schema?.spec.instanceCreateParameterSchema || {};
};

const PlanColumnContent = ({
  defaultPlan,
  onPlanChange,
  dropdownRef,
  allPlans,
}) => {
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
  defaultPlan: SERVICE_PLAN_SHAPE,
  onPlanChange: PropTypes.func.isRequired,
  dropdownRef: CustomPropTypes.ref.isRequired,
  allPlans: PropTypes.arrayOf(SERVICE_PLAN_SHAPE),
};

const isNonNullObject = o => typeof o === 'object' && !!o;

export default function CreateInstanceModal({
  onCompleted,
  onChange,
  onError,
  setCustomValid,
  formElementRef,
  jsonSchemaFormRef,
  item,
  documentationUrl,
  plans,
}) {
  const notificationManager = useNotification();
  const postRequest = usePost();
  const [customParametersProvided, setCustomParametersProvided] = useState(
    false,
  );
  const [instanceCreateParameters, setInstanceCreateParameters] = useState({});
  useEffect(() => {
    setCustomValid(true);
    // Make the form initially valid because a form without instanceCreateParameters is always valid.
    // It'll be immiediately overwritten once plan or instanceCreateParameters are changed

    // eslint-disable-next-line
  }, []);

  plans.forEach(plan => {
    parseDefaultIntegerValues(plan);
  });
  const plan = plans[0]?.metadata.name;
  const [
    instanceCreateParameterSchema,
    setInstanceCreateParameterSchema,
  ] = useState(getInstanceCreateParameterSchema(plans, plan));
  const formValues = {
    name: useRef(null),
    plan: useRef(plan),
    labels: useRef(null),
  };

  const defaultName =
    `${item.spec.externalName}-${randomNameGenerator()}` ||
    randomNameGenerator();

  const instanceCreateParameterSchemaExists =
    instanceCreateParameterSchema &&
    (instanceCreateParameterSchema.$ref ||
      instanceCreateParameterSchema.properties);

  async function createInstance({ name, namespace, inputData }) {
    const input = createInstanceInput(name, namespace, inputData);
    try {
      await postRequest(
        `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${namespace}/serviceinstances`,
        input,
      );

      notificationManager.notifySuccess({
        content: `Resource created succesfully`,
      });

      LuigiClient.linkManager()
        .fromContext('namespaces')
        .navigate(`cmf-instances/details/${name}`);
    } catch (err) {
      notificationManager.notifyError({
        content: `Failed to create a Resource due to: ${err}`,
      });
    }
  }

  const handlePlanChange = e => {
    const newParametersSchema = getInstanceCreateParameterSchema(
      plans,
      e.target.value,
    );

    setInstanceCreateParameterSchema(newParametersSchema);
    setInstanceCreateParameters({});
    if (!newParametersSchema || !newParametersSchema.length) {
      jsonSchemaFormRef.current = null;
    }
  };

  const handleCustomParametersChange = input => {
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
    const currentPlan =
      plans?.find(e => e.name === formValues.plan.current.value) ||
      (plans?.length && plans[0]);
    const labels =
      formValues.labels.current.value === ''
        ? []
        : formValues.labels.current.value
            .replace(/\s+/g, '')
            .toLowerCase()
            .split(',');
    const isClusterServiceClass = item.__typename === 'ClusterServiceClass';
    const variables = {
      externalServiceClassName: item.externalName,
      externalPlanName: currentPlan && currentPlan.externalName,
      classClusterWide: isClusterServiceClass,
      planClusterWide: isClusterServiceClass,
      labels,
      parameterSchema: instanceCreateParameters,
    };

    await createInstance({
      name: formValues.name.current.value,
      namespace: LuigiClient.getContext().namespaceId,
      inputData: variables,
    });
  }

  return (
    <>
      <form
        ref={formElementRef}
        style={{ width: '47em' }}
        onChange={onChange}
        onLoad={onChange}
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
                defaultPlan={plan}
                onPlanChange={handlePlanChange}
                dropdownRef={formValues.plan}
                allPlans={plans}
              />
            </div>
          </div>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="labels">
            Filter labels
            <InlineHelp
              placement="bottom-right"
              text="
              The filter label must consist of lower case alphanumeric characters. Separate labels with comma.
              "
              className="fd-has-margin-left-tiny"
            />
          </FormLabel>
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
          key={formValues.plan.current.value}
          schemaFormRef={jsonSchemaFormRef}
          data={instanceCreateParameters || {}}
          instanceCreateParameterSchema={instanceCreateParameterSchema}
          planName={
            (formValues.plan &&
              formValues.plan.current &&
              formValues.plan.current.value) ||
            ''
          }
          onSubmitSchemaForm={() => {}}
          onFormChange={formData => {
            onChange(formData);
            setInstanceCreateParameters(formData.instanceCreateParameters);
          }}
        />
      )}

      {!instanceCreateParameterSchemaExists && (
        <>
          <div className="fd-has-margin-top-s fd-has-margin-bottom-tiny instance-schema-panel">
            <div>
              <Link
                className="link fd-has-margin-right-tiny clear-underline"
                onClick={() =>
                  setCustomParametersProvided(!customParametersProvided)
                }
              >
                {customParametersProvided
                  ? 'Remove parameters'
                  : 'Add parameters'}
              </Link>
              <Tooltip
                position="top"
                content="The service provider did not define specific parameters for the selected plan. Refer to the documentation to learn about the required parameters, and define them as JSON in the editor."
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
