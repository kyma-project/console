import React, { useState, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useNotification } from '../../../contexts/notifications';
import LuigiClient from '@kyma-project/luigi-client';
import { K8sNameInput, InputWithSuffix } from 'react-shared';
import {
  ActionBar,
  Button,
  LayoutGrid,
  FormGroup,
  FormItem,
  FormLabel,
  Panel,
} from 'fundamental-react';

import './CreateApiRule.scss';

import AccessStrategy from './AccessStrategy/AccessStrategy';
import { GET_SERVICES } from '../../../gql/queries';
import { CREATE_API_RULE } from '../../../gql/mutations';
import { getApiUrl } from '@kyma-project/common';
import ServicesDropdown from './ServicesDropdown/ServicesDropdown';

const defaultAccessStrategy = {
  path: '/.*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  accessStrategies: [
    {
      name: 'allow',
      config: {},
    },
  ],
  mutators: [],
};

const defaultGateway = 'kyma-gateway.kyma-system.svc.cluster.local';
const DOMAIN = getApiUrl('domain');

const CreateApiRule = () => {
  const [accessStrategies /*setAccessStrategies*/] = useState([
    defaultAccessStrategy,
  ]);
  const [createApiRuleMutation] = useMutation(CREATE_API_RULE);
  const notificationManager = useNotification();
  const [isValid, setValid] = useState(false);

  const servicesQueryResult = useQuery(GET_SERVICES, {
    variables: { namespace: LuigiClient.getEventData().environmentId },
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

  async function handleCreate() {
    if (!formRef.current.checkValidity()) {
      return;
    }
    const [serviceName, servicePort] = formValues.service.current.value.split(
      ':',
    );

    const variables = {
      name: formValues.name.current.value,
      namespace: LuigiClient.getEventData().environmentId,
      params: {
        host: formValues.hostname.current.value + '.' + DOMAIN,
        serviceName,
        servicePort,
        gateway: defaultGateway,
        rules: accessStrategies,
      },
    };

    try {
      const createdApiRule = await createApiRuleMutation({ variables });
      const createdApiRuleData =
        createdApiRule.data && createdApiRule.data.createAPIRule;

      if (createdApiRuleData) {
        notificationManager.notify({
          content: `API Rule ${createdApiRuleData.name} created successfully`,
          title: 'Success',
          color: '#107E3E',
          icon: 'accept',
          autoClose: true,
        });
      }
    } catch (e) {
      notificationManager.notify({
        content: `Error while creating API Rule ${variables.name}: ${e.message}`,
        title: 'Error',
        color: '#BB0000',
        icon: 'decline',
        autoClose: false,
      });
    }
  }

  return (
    <>
      <header className="fd-has-background-color-background-2 sticky">
        <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
          <section>
            <ActionBar.Header title="Create API Rule" />
          </section>
          <ActionBar.Actions>
            <Button
              onClick={handleCreate}
              disabled={!isValid}
              option="emphasized"
              aria-label="submit-form"
            >
              Create
            </Button>
          </ActionBar.Actions>
        </section>
      </header>

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
                        showHelp={false}
                      />
                    </FormItem>
                    <FormItem>
                      <FormLabel htmlFor="hostname" required>
                        Hostname
                      </FormLabel>
                      <InputWithSuffix
                        id="hostname"
                        suffix={DOMAIN}
                        placeholder="Enter the hostname"
                        required
                        pattern="^[a-zA-Z][a-zA-Z_-]*[a-zA-Z]$"
                        _ref={formValues.hostname}
                      />
                    </FormItem>
                    <ServicesDropdown
                      _ref={formValues.service}
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
              {accessStrategies.map(strategy => {
                return (
                  <AccessStrategy
                    key={strategy.path + strategy.accessStrategies[0].name}
                    strategy={strategy}
                  />
                );
              })}
            </Panel.Body>
          </Panel>
        </LayoutGrid>
      </section>
    </>
  );
};

export default CreateApiRule;
