import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import LuigiClient from '@luigi-project/client';

import { Spinner, useNotification } from 'react-shared';
import { UPDATE_API_RULE } from '../../../gql/mutations';
import { GET_API_RULE } from '../../../gql/queries';
import ApiRuleForm from '../ApiRuleForm/ApiRuleForm';
import EntryNotFound from 'components/EntryNotFound/EntryNotFound';

EditApiRule.propTypes = {
  apiName: PropTypes.string.isRequired,
};

export default function EditApiRule({ apiName }) {
  const { redirectPath, redirectCtx = 'namespaces' } =
    LuigiClient.getNodeParams() || {};
  const [updateApiRuleMutation] = useMutation(UPDATE_API_RULE, {
    onError: handleError,
    onCompleted: handleSuccess,
  });
  const notificationManager = useNotification();

  const { error, loading, data } = useQuery(GET_API_RULE, {
    variables: {
      namespace: LuigiClient.getEventData().environmentId,
      name: apiName,
    },
    fetchPolicy: 'no-cache',
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <h1>Couldn't fetch API rule data</h1>;
  }

  if (!data.APIRule || !data.APIRule.spec) {
    return <EntryNotFound entryType="API Rule" entryId={apiName} />;
  }

  data.APIRule.spec.rules.forEach(rule => {
    delete rule.__typename;
    rule.accessStrategies.forEach(as => {
      delete as.__typename;
    });
  });

  function handleError(error) {
    if (redirectPath) {
      LuigiClient.linkManager()
        .fromContext(redirectCtx)
        .navigate(redirectPath.split('&sol;').join('/'));
      return;
    }

    notificationManager.notifyError({
      content: `Could not update API Rule: ${error.message}`,
    });
  }

  function handleSuccess(data) {
    if (redirectPath) {
      LuigiClient.linkManager()
        .fromContext(redirectCtx)
        .navigate(redirectPath.split('&sol;').join('/'));
      return;
    }

    const editedApiRuleData = data.updateAPIRule;
    if (editedApiRuleData) {
      notificationManager.notifySuccess({
        content: `API Rule ${editedApiRuleData.name} updated successfully`,
      });

      LuigiClient.linkManager()
        .fromClosestContext()
        .navigate(`/details/${apiName}`);
    }
  }

  const breadcrumbItems = [
    { name: 'API Rules', path: '/' },
    { name: apiName, path: `/details/${apiName}` },
    { name: '' },
  ];

  return (
    <ApiRuleForm
      apiRule={data.APIRule}
      mutation={updateApiRuleMutation}
      saveButtonText="Save"
      headerTitle={`Edit ${apiName}`}
      breadcrumbItems={breadcrumbItems}
    />
  );
}
