import React, { useState, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useNotification } from '../../../contexts/notifications';
import LuigiClient from '@kyma-project/luigi-client';
import { K8sNameInput, InputWithSuffix } from 'react-shared';
import {
  LayoutGrid,
  FormGroup,
  FormItem,
  FormLabel,
  Panel,
} from 'fundamental-react';

import './CreateApiRule.scss';
import CreateApiRuleHeader from './CreateApiRuleHeader/CreateApiRuleHeader';
import AccessStrategy from './AccessStrategy/AccessStrategy';
import {
  GET_SERVICES,
  GET_API_RULE,
  GET_API_RULES,
} from '../../../gql/queries';
import { CREATE_API_RULE } from '../../../gql/mutations';
import { getApiUrl } from '@kyma-project/common';
import ServicesDropdown from './ServicesDropdown/ServicesDropdown';

const DEFAULT_ACCESS_STRATEGY = {
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

const DEFAULT_GATEWAY = 'kyma-gateway.kyma-system.svc.cluster.local';
const DOMAIN = getApiUrl('domain');

export default function CreateApiRule({ apiName }) {
  const namespace = LuigiClient.getEventData().environmentId;
  const [accessStrategies /*setAccessStrategies*/] = useState([
    DEFAULT_ACCESS_STRATEGY,
  ]);
  const [createApiRuleMutation] = useMutation(CREATE_API_RULE, {
    refetchQueries: [{ query: GET_API_RULES, variables: { namespace } }],
  });
  const notificationManager = useNotification();
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

  const apiQuery = useQuery(GET_API_RULE, {
    variables: {
      namespace,
      name: apiName,
    },
  });

  const apiData =
    apiQuery.data && apiQuery.data.APIRule ? apiQuery.data.APIRule : null;

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
        gateway: DEFAULT_GATEWAY,
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
      <CreateApiRuleHeader
        apiData={apiData}
        isValid={isValid}
        handleCreate={handleCreate}
        isInViewMode={!!apiName}
      />
      <section className="fd-section api-rule-container">
        <LayoutGrid cols={1}>
          {!apiName && (
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
                          pattern="^[a-z][a-z0-9_-]*[a-z]$"
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
          )}

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
}
