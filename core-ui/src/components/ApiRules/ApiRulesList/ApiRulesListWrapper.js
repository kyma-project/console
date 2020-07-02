import React from 'react';

import ApiRulesList from './ApiRulesList';
import { useApiRulesQuery } from 'components/ApiRules/gql/useApiRulesQuery';

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
}) {
  const { apiRules = [], error, loading } = useApiRulesQuery({
    namespace: namespace || service?.namespace,
    serviceName: service?.name,
  });

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
      apiRules={apiRules}
      serverDataError={error || false}
      serverDataLoading={loading || false}
    />
  );
}
