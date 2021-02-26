import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { createPatch } from 'rfc6902';
import LuigiClient from '@luigi-project/client';
import classNames from 'classnames';
import { K8sNameInput, InputWithSuffix } from 'react-shared';
import {
  LayoutGrid,
  FormGroup,
  FormItem,
  FormLabel,
  Panel,
  InlineHelp,
  Button,
} from 'fundamental-react';
import { supportedMethodsList } from '../accessStrategyTypes';

import './ApiRuleForm.scss';
import ApiRuleFormHeader from './ApiRuleFormHeader/ApiRuleFormHeader';
import { getApiUrl } from '@kyma-project/common';
import ServicesDropdown from './ServicesDropdown/ServicesDropdown';
import AccessStrategyForm from './AccessStrategyForm/AccessStrategyForm';
import { EXCLUDED_SERVICES_LABELS } from 'components/ApiRules/constants';
import { hasValidMethods } from 'components/ApiRules/accessStrategyTypes';
import { useGet } from 'react-shared';
import { SERVICES_URL, API_RULE_URL } from '../constants';
import { formatMessage as injectVariables } from 'components/Lambdas/helpers/misc';

export const DEFAULT_GATEWAY = 'kyma-gateway.kyma-system.svc.cluster.local';
const DOMAIN = getApiUrl('domain');

const EMPTY_ACCESS_STRATEGY = {
  path: '',
  methods: supportedMethodsList,
  accessStrategies: [
    {
      handler: 'allow',
      config: {},
    },
  ],
};

ApiRuleForm.propTypes = {
  apiRule: PropTypes.object.isRequired,
  mutation: PropTypes.func.isRequired,
  mutationType: PropTypes.string,
  saveButtonText: PropTypes.string.isRequired,
  headerTitle: PropTypes.string.isRequired,
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
    }),
  ),
};

export default function ApiRuleForm({
  apiRule,
  mutation,
  mutationType,
  saveButtonText,
  headerTitle,
  breadcrumbItems,
}) {
  const namespace = LuigiClient.getEventData().environmentId;
  const { serviceName, port, openedInModal = false } =
    LuigiClient.getNodeParams() || {};
  const openedInModalBool = openedInModal.toString().toLowerCase() === 'true';

  const [rules, setRules] = useState(
    apiRule.spec.rules.map(r => ({ ...r, renderKey: uuid() })),
  );
  const [isValid, setValid] = useState(false);
  const [methodsValid, setMethodsValid] = useState(true);

  if (serviceName && port) {
    apiRule.spec.service.name = serviceName;
    apiRule.spec.service.port = port;
  }

  const { data, error, loading = true } = useGet(
    injectVariables(SERVICES_URL, {
      namespace: namespace,
    }),
    { pollingInterval: 3000 },
  );

  const services =
    data?.items.filter(service => {
      let show = true;
      EXCLUDED_SERVICES_LABELS.forEach(excludedLabel => {
        if (Object.keys(service?.metadata.labels).includes([excludedLabel])) {
          show = false;
        }
      });
      return show;
    }) || [];

  React.useEffect(() => setMethodsValid(rules.every(hasValidMethods)), [rules]);

  const formRef = useRef(null);
  const formValues = {
    name: useRef(null),
    hostname: useRef(null),
    runtime: useRef(null),
    service: useRef(null),
  };

  function handleFormChanged(e) {
    setValid(formRef.current.checkValidity()); // general form validity
    if (!e) {
      return;
    }

    if (typeof e.target.reportValidity === 'function') {
      // for IE
      e.target.reportValidity();
    }

    if (e.target.getAttribute('data-ignore-visual-validation')) {
      return;
    }

    // current element validity
    const isValid = e.target.checkValidity();
    e.target.classList.toggle('is-invalid', !isValid);
  }

  async function save() {
    if (!formRef.current.checkValidity()) {
      return;
    }
    const [serviceName, servicePort] = formValues.service.current.value.split(
      ':',
    );

    const variables = {
      metadata: {
        name: formValues.name.current.value,
        namespace: namespace,
        generation: apiRule?.metadata.generation || 1,
      },
      spec: {
        service: {
          host: formValues.hostname.current.value + '.' + DOMAIN,
          name: serviceName,
          port: parseInt(servicePort),
        },
        gateway: DEFAULT_GATEWAY,
        rules: rules.map(({ renderKey, ...actualRule }) => actualRule),
      },
    };

    const newApiRule = {
      ...apiRule,
      ...variables,
      metadata: {
        ...apiRule.metadata,
        ...variables.metadata,
      },
      spec: {
        ...apiRule.spec,
        ...variables.spec,
      },
    };
    const mutationData =
      mutationType === 'create' ? newApiRule : createPatch(apiRule, newApiRule);

    await mutation(
      injectVariables(API_RULE_URL, {
        name: formValues.name.current.value,
        namespace: namespace,
      }),
      mutationData,
    );

    LuigiClient.uxManager().closeCurrentModal();
  }

  function addAccessStrategy() {
    setRules(rules => [
      ...rules,
      { ...EMPTY_ACCESS_STRATEGY, renderKey: uuid() },
    ]);
    setValid(false);
  }

  function removeAccessStrategy(index) {
    setRules(rules => [...rules.slice(0, index), ...rules.slice(index + 1)]);
    setTimeout(handleFormChanged);
  }

  return (
    <div
      className={classNames('api-rule-form', {
        'api-rule-form--in-modal': openedInModalBool,
      })}
    >
      <ApiRuleFormHeader
        isValid={isValid && methodsValid}
        handleSave={save}
        saveButtonText={saveButtonText}
        title={headerTitle}
        breadcrumbItems={breadcrumbItems}
        serviceName={serviceName}
        openedInModalBool={openedInModalBool}
      />
      <section className="api-rule-form__form">
        <form
          onSubmit={e => e.preventDefault()}
          onChange={e => handleFormChanged(e)}
          ref={formRef}
        >
          <LayoutGrid cols={1}>
            <Panel>
              <Panel.Header>
                <Panel.Head title="General settings" />
              </Panel.Header>
              <Panel.Body>
                <FormGroup>
                  <LayoutGrid cols="3">
                    <FormItem>
                      <K8sNameInput
                        _ref={formValues.name}
                        id="apiRuleName"
                        kind="API Rule"
                        showHelp={!apiRule?.metadata.name}
                        defaultValue={apiRule?.metadata.name}
                        disabled={!!apiRule?.metadata.name}
                      />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="hostname" required>
                        Hostname
                        <InlineHelp
                          placement="bottom-right"
                          text="The hostname must consist of alphanumeric characters, dots or dashes, 
                          and must start and end with an alphanumeric character (e.g. 'my-name1')."
                        />
                      </FormLabel>
                      <InputWithSuffix
                        defaultValue={apiRule.spec.service.host.replace(
                          `.${DOMAIN}`,
                          '',
                        )}
                        id="hostname"
                        suffix={DOMAIN}
                        placeholder="Enter the hostname"
                        required
                        pattern="^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$"
                        _ref={formValues.hostname}
                      />
                    </FormItem>
                    <ServicesDropdown
                      _ref={formValues.service}
                      defaultValue={apiRule.spec.service}
                      serviceName={serviceName}
                      data={services}
                      error={error}
                      loading={loading}
                    />
                  </LayoutGrid>
                </FormGroup>
              </Panel.Body>
            </Panel>

            <Panel>
              <Panel.Header>
                <Panel.Head title="Access strategies" />
                <Panel.Actions>
                  <Button
                    onClick={addAccessStrategy}
                    option="light"
                    glyph="add"
                    typeAttr="button"
                  >
                    Add access strategy
                  </Button>
                </Panel.Actions>
              </Panel.Header>
              {!!rules.length && (
                <Panel.Body>
                  {rules.map((rule, idx) => {
                    return (
                      <AccessStrategyForm
                        key={rule.renderKey}
                        strategy={rule}
                        setStrategy={newStrategy => {
                          setRules(rules => [
                            ...rules.slice(0, idx),
                            newStrategy,
                            ...rules.slice(idx + 1, rules.length),
                          ]);
                          setValid(false);
                          handleFormChanged();
                        }}
                        removeStrategy={() => removeAccessStrategy(idx)}
                        canDelete={rules.length > 1}
                        handleFormChanged={() => setTimeout(handleFormChanged)}
                      />
                    );
                  })}
                </Panel.Body>
              )}
            </Panel>
          </LayoutGrid>
        </form>
      </section>
    </div>
  );
}
