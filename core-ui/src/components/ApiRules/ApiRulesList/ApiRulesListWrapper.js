import React from 'react';

import ApiRulesList from './ApiRulesList';
import { useGetList, Spinner } from 'react-shared';
import { API_RULES_URL } from '../constants';
import { formatMessage as injectVariables } from 'components/Lambdas/helpers/misc';

export default function ApiRulesListWrapper({
  service = undefined,
  resourceType = '',
  noTitle = false,
  namespace = undefined,
  inSubView = false,
  redirectPath = undefined,
  redirectCtx = 'namespaces',
  portForCreate = undefined,
  headerRenderer = undefined,
  rowRenderer = undefined,
  textSearchProperties = undefined,
  disableExposeButton = false,
}) {
  const { data: apiRulesForThisService, error, loading = true } = useGetList(
    rule => rule.spec.service.name === service?.metadata.name,
  )(
    injectVariables(API_RULES_URL, {
      namespace: namespace || service?.metadata.namespace,
    }),
    { pollingInterval: 3000 },
  );

  if (!apiRulesForThisService) return <Spinner />;

  return (
    <ApiRulesList
      service={service}
      resourceType={resourceType}
      noTitle={noTitle}
      inSubView={inSubView}
      redirectCtx={redirectCtx}
      redirectPath={redirectPath}
      portForCreate={portForCreate}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={textSearchProperties}
      apiRules={apiRulesForThisService}
      serverDataError={error || false}
      serverDataLoading={loading || false}
      disableExposeButton={disableExposeButton}
    />
  );
}
