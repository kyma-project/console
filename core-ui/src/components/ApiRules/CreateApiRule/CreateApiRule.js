import React, { useState, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import classNames from 'classnames';
import { useNotification } from '../../../contexts/notifications';
import LuigiClient from '@kyma-project/luigi-client';
import { K8sNameInput } from 'react-shared';
import {
  ActionBar,
  Button,
  LayoutGrid,
  FormGroup,
  FormItem,
  FormLabel,
  Panel,
  FormSelect,
} from 'fundamental-react';

import './CreateApiRule.scss';

import AccessStrategy from './AccessStrategy';
import { GET_SERVICES } from '../../../gql/queries';
import { CREATE_API_RULE } from '../../../gql/mutations';
import { getApiUrl } from '@kyma-project/common';

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

const createAPIRuleSample = {
  name: 'sth',
  namespace: 'default',
  params: {
    host: 'host',
    serviceName: 'serviceName',
    servicePort: 443,
    gateway: 'kyma-gateway.kyma-system.svc.cluster.local',
    rules: [defaultAccessStrategy],
  },
};

const templateAccessStrategies = [
  {
    path: '/favicon',
    methods: ['GET', 'POST'],
    accessStrategies: [
      {
        name: 'allow',
        config: {},
      },
    ],
  },
  {
    path: '/img',
    methods: ['PUT', 'GET'],
    accessStrategies: [
      {
        name: 'jwt',
        config: {},
      },
    ],
  },
  {
    path: '/headers',
    methods: ['GET', 'DELETE'],
    accessStrategies: [
      {
        name: 'oauth2_introspection',
        config: {},
      },
    ],
  },
];

const DOMAIN = getApiUrl('domain');
const ServicesDropdown = function({ loading, data, error }) {
  console.log('data', loading, data, error);
  if (loading) {
    return 'Loading...';
  }
  if (error) {
    return error.message;
  }
  return (
    <FormItem>
      <FormLabel>Service</FormLabel>
      <FormSelect defaultValue="1" id="select-1">
        {data.services.map(service => (
          <option value="1">
            {service.name}({DOMAIN}:{service.ports.port})
          </option>
        ))}
        foo-service (foo4.kyma.local:8080)
      </FormSelect>
    </FormItem>
  );
};
const CreateApiRule = () => {
  const [accessStrategies, setAccessStrategies] = useState([
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
    host: useRef(null),
    runtime: useRef(null),
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

  // function addAccessStrategy() {
  //   addDefaultAccessStrategy();
  // }
  function addDefaultAccessStrategy() {
    setAccessStrategies([...accessStrategies, defaultAccessStrategy]);
  }
  async function handleCreate() {
    if (!formRef.current.checkValidity()) {
      return;
    }

    const variables = {
      name: formValues.name.current.value,
      namespace: LuigiClient.getEventData().environmentId,
      params: {
        host: formValues.host.current.value,
        serviceName: 'serviceName',
        servicePort: 443,
        gateway: defaultGateway,
        rules: accessStrategies,
      },
    };
    console.log('variables', variables);
    try {
      const updatedApiRule = '';
      await createApiRuleMutation({ variables });
      const isSuccess =
        updatedApiRule.data &&
        updatedApiRule.data.updateAPIRule &&
        updatedApiRule.data.updateAPIRule.name === createAPIRuleSample.name;
      if (isSuccess) {
        notificationManager.notify({
          content: `ApiRule ${createAPIRuleSample.name} updated successfully`,
          title: 'Success',
          color: '#107E3E',
          icon: 'accept',
          autoClose: true,
        });
      }
    } catch (e) {
      notificationManager.notify({
        content: `Error while updating API Rule ${createAPIRuleSample.name}: ${e.message}`,
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
                        className={classNames([{ 'is-invalid': !isValid }])}
                      />
                    </FormItem>
                    <FormItem>
                      <K8sNameInput
                        _ref={formValues.host}
                        id="host"
                        kind="Host"
                        showHelp={false}
                        label="Host *"
                        className={classNames([{ 'is-invalid': !isValid }])}
                      />
                    </FormItem>
                    <ServicesDropdown {...servicesQueryResult} />
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
                console.log('strategy', strategy);
                return (
                  <AccessStrategy
                    strategy={strategy}
                    selectedType={strategy.accessStrategies[0].name}
                    path={strategy.path}
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
