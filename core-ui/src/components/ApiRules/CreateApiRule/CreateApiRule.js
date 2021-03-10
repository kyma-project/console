import React from 'react';

import { usePost } from 'react-shared';
import ApiRuleForm from '../ApiRuleForm/ApiRuleForm';
import { supportedMethodsList } from '../accessStrategyTypes';

const DEFAULT_ACCESS_STRATEGY = {
  path: '/.*',
  methods: supportedMethodsList,
  accessStrategies: [
    {
      handler: 'allow',
      config: {},
    },
  ],
};

const emptyApiRule = {
  apiVersion: 'gateway.kyma-project.io/v1alpha1',
  kind: 'APIRule',
  metadata: {
    name: '',
    namespace: '',
    generation: 1,
  },
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
  const createApiRuleMutation = usePost();

  const breadcrumbItems = [{ name: 'API Rules', path: '/' }, { name: '' }];

  return (
    <ApiRuleForm
      apiRule={emptyApiRule}
      mutation={createApiRuleMutation}
      mutationType="create"
      saveButtonText="Create"
      headerTitle="Create API Rule"
      breadcrumbItems={breadcrumbItems}
    />
  );
}
