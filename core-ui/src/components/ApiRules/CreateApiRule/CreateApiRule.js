import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { useNotification } from 'react-shared';
import { CREATE_API_RULE } from '../../../gql/mutations';
import ApiRuleForm from '../ApiRuleForm/ApiRuleForm';
import LuigiClient from '@luigi-project/client';
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
};

const emptyApiRule = {
  name: '',
  spec: {
    service: {
      host: '',
      name: '',
      port: '',
    },
    rules: [DEFAULT_ACCESS_STRATEGY],
  },
};

export default function CreateApiRule() {
  const { redirectPath, redirectCtx = 'namespaces' } =
    LuigiClient.getNodeParams() || {};
  const [createApiRuleMutation] = useMutation(CREATE_API_RULE, {
    onError: handleCreateError,
    onCompleted: handleCreateSuccess,
  });
  const notificationManager = useNotification();

  function handleCreateError(error) {
    if (redirectPath) {
      LuigiClient.linkManager()
        .fromContext(redirectCtx)
        .navigate(redirectPath.split('&sol;').join('/'));
      return;
    }

    notificationManager.notifyError({
      content: `Could not create API Rule: ${error.message}`,
    });
  }

  function handleCreateSuccess(data) {
    if (redirectPath) {
      LuigiClient.linkManager()
        .fromContext(redirectCtx)
        .navigate(redirectPath.split('&sol;').join('/'));
      return;
    }

    const createdApiRuleData = data.createAPIRule;
    if (createdApiRuleData) {
      notificationManager.notifySuccess({
        content: `API Rule ${createdApiRuleData.name} created successfully`,
      });

      LuigiClient.linkManager()
        .fromClosestContext()
        .navigate(`/details/${createdApiRuleData.name}`);
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
