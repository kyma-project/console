import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useNotification } from 'react-shared';
import { CREATE_API_RULE } from '../../../gql/mutations';
import ApiRuleForm from '../ApiRuleForm/ApiRuleForm';
import LuigiClient from '@kyma-project/luigi-client';
import { supportedMethodsList } from '../accessStrategyTypes';

const DEFAULT_ACCESS_STRATEGY = {
  path: '/.*',
  methods: supportedMethodsList,
  accessStrategies: [
    {
      name: 'noop',
      config: {},
    },
  ],
  mutators: [],
};

const emptyApiRule = {
  name: '',
  service: {
    host: '',
    name: '',
    port: '',
  },
  rules: [DEFAULT_ACCESS_STRATEGY],
};

export default function CreateApiRule() {
  const [createApiRuleMutation] = useMutation(CREATE_API_RULE, {
    onError: handleCreateError,
    onCompleted: handleCreateSuccess,
  });
  const notificationManager = useNotification();

  function navigateToDetails(name) {
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(`/details/${name}`);
  }

  function handleCreateError(error) {
    notificationManager.notifyError({
      content: `Could not create API Rule: ${error.message}`,
    });
  }

  function handleCreateSuccess(data) {
    const createdApiRuleData = data.createAPIRule;

    if (createdApiRuleData) {
      notificationManager.notifySuccess({
        content: `API Rule ${createdApiRuleData.name} created successfully`,
      });

      navigateToDetails(createdApiRuleData.name);
    }
  }

  const breadcrumbItems = [{ name: 'API Rules', path: '/' }, { name: '' }];

  return (
    <ApiRuleForm
      apiRule={emptyApiRule}
      mutation={createApiRuleMutation}
      saveButtonText="Create"
      headerTitle="Create API Rule"
      breadcrumbItems={breadcrumbItems}
    />
  );
}
