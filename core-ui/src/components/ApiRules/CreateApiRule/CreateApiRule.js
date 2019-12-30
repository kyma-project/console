import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useNotification } from '../../../contexts/notifications';

import { CREATE_API_RULE } from '../../../gql/mutations';
import ApiRuleForm from '../ApiRuleForm/ApiRuleForm';

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

  function handleCreateError(error) {
    notificationManager.notify({
      content: `Could not create API Rule: ${error.message}`,
      title: 'Error',
      color: '#BB0000',
      icon: 'decline',
      autoClose: false,
    });
  }

  function handleCreateSuccess(data) {
    const createdApiRuleData = data.createAPIRule;

    if (createdApiRuleData) {
      notificationManager.notify({
        content: `API Rule ${createdApiRuleData.name} created successfully`,
        title: 'Success',
        color: '#107E3E',
        icon: 'accept',
        autoClose: true,
      });
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
