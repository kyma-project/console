import React from 'react';
import PropTypes from 'prop-types';

import { useGet, useUpdate, useMicrofrontendContext } from 'react-shared';
import { Spinner } from 'react-shared';
import ApiRuleForm from '../ApiRuleForm/ApiRuleForm';
import EntryNotFound from 'components/EntryNotFound/EntryNotFound';
import { formatMessage as injectVariables } from 'components/Lambdas/helpers/misc';
import { API_RULE_URL } from '../constants';

EditApiRule.propTypes = {
  apiName: PropTypes.string.isRequired,
};

export default function EditApiRule({ apiName }) {
  const updateApiRuleMutation = useUpdate();
  const { namespaceId: namespace } = useMicrofrontendContext();

  const { data, error, loading = true } = useGet(
    injectVariables(API_RULE_URL, {
      namespace,
      name: apiName,
    }),
    { pollingInterval: 0 },
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <h1>Couldn't fetch API rule data</h1>;
  }

  if (!data || !data.spec) {
    return <EntryNotFound entryType="API Rule" entryId={apiName} />;
  }

  const breadcrumbItems = [
    { name: 'API Rules', path: '/' },
    { name: apiName, path: `/details/${apiName}` },
    { name: '' },
  ];

  return (
    <ApiRuleForm
      apiRule={data}
      mutation={updateApiRuleMutation}
      saveButtonText="Save"
      headerTitle={`Edit ${apiName}`}
      breadcrumbItems={breadcrumbItems}
    />
  );
}
