import React, { useState, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { K8sNameInput, InputWithSuffix } from 'react-shared';
import {
  LayoutGrid,
  FormGroup,
  FormItem,
  FormLabel,
  Panel,
  InlineHelp,
} from 'fundamental-react';

import './ApiRuleForm.scss';
import ApiRuleFormHeader from './ApiRuleFormHeader/ApiRuleFormHeader';
import AccessStrategy from '../AccessStrategy/AccessStrategy';
import { GET_SERVICES } from '../../../gql/queries';
import { getApiUrl } from '@kyma-project/common';
import ServicesDropdown from './ServicesDropdown/ServicesDropdown';

const DEFAULT_GATEWAY = 'kyma-gateway.kyma-system.svc.cluster.local';
const DOMAIN = getApiUrl('domain');

export default function ApiRuleForm({
  apiRule,
  mutation,
  saveButtonText,
  headerTitle,
  breadcrumbItems,
}) {
  const namespace = LuigiClient.getEventData().environmentId;
  const [rules /*setrules*/] = useState(apiRule.rules);

  const [isValid, setValid] = useState(false);

  const servicesQueryResult = useQuery(GET_SERVICES, {
    variables: { namespace },
  });

  const formRef = useRef(null);
  const formValues = {
    name: useRef(null),
    hostname: useRef(null),
    runtime: useRef(null),
    service: useRef(null),
  };

  function handleFormChanged(e) {
    setValid(formRef.current.checkValidity()); // general form validity
    if (typeof e.target.reportValidity === 'function') {
      // for IE
      e.target.reportValidity();
    }

    if (e.target.getAttribute('data-ignore-visual-validation')) {
      return;
    }

    // current element validity
    if (e.target.checkValidity()) {
      e.target.classList.remove('is-invalid');
    } else {
      e.target.classList.add('is-invalid');
    }
  }

  function save() {
    if (!formRef.current.checkValidity()) {
      return;
    }
    const [serviceName, servicePort] = formValues.service.current.value.split(
      ':',
    );

    const variables = {
      name: formValues.name.current.value,
      namespace,
      params: {
        host: formValues.hostname.current.value + '.' + DOMAIN,
        serviceName,
        servicePort,
        gateway: DEFAULT_GATEWAY,
        rules: rules,
      },
    };
    mutation({ variables });
  }

  return (
    <>
      <ApiRuleFormHeader
        isValid={isValid}
        handleSave={save}
        title={headerTitle}
        saveButtonText={saveButtonText}
        breadcrumbItems={breadcrumbItems}
      />
      <section className="fd-section api-rule-container">
        <LayoutGrid cols={1}>
          <Panel>
            <Panel.Header>
              <Panel.Head title="General settings" />
            </Panel.Header>
            <Panel.Body>
              <form
                onSubmit={e => e.preventDefault()}
                onChange={e => handleFormChanged(e)}
                ref={formRef}
              >
                <FormGroup>
                  <LayoutGrid cols="3">
                    <FormItem>
                      <K8sNameInput
                        _ref={formValues.name}
                        id="apiRuleName"
                        kind="API Rule"
                        showHelp={true}
                        defaultValue={apiRule.name}
                        disabled={!!apiRule.name}
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
                        defaultValue={apiRule.service.host.replace(
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
                      defaultValue={apiRule.service}
                      {...servicesQueryResult}
                    />
                  </LayoutGrid>
                </FormGroup>
              </form>
            </Panel.Body>
          </Panel>

          <Panel>
            <Panel.Header>
              <Panel.Head title="Access strategies" />
              {/* <Panel.Actions>
                <Button onClick={addAccessStrategy} glyph="add">Add access strategy</Button>
              </Panel.Actions> */}
            </Panel.Header>
            <Panel.Body>
              {rules.map(rule => {
                return (
                  <AccessStrategy
                    key={rule.path + rule.accessStrategies[0].name}
                    strategy={rule}
                  />
                );
              })}
            </Panel.Body>
          </Panel>
        </LayoutGrid>
      </section>
    </>
  );
}
