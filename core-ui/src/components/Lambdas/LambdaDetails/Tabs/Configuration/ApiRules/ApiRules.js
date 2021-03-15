import React from 'react';

import ApiRuleStatus from 'components/ApiRules/ApiRuleStatus/ApiRuleStatus';
import {
  GoToApiRuleDetails,
  CopiableApiRuleHost,
  ApiRuleAccessStrategiesList,
} from 'components/ApiRules/ApiRulesList/components';

import ApiRulesListWrapper from 'components/ApiRules/ApiRulesList/ApiRulesListWrapper';

import { useServiceQuery } from 'components/Lambdas/gql/hooks/queries';
import { LAMBDA_PHASES } from 'components/Lambdas/constants';
import { useGetGatewayDomain } from 'components/ApiRules/useGetGatewayDomain/useGetGatewayDomain';

const headerRenderer = () => ['', 'Name', 'Host', 'Status'];
const textSearchProperties = [
  'metadata.name',
  'service.host',
  'status.apiRuleStatus.code',
];

export default function ApiRules({ lambda }) {
  const { domain } = useGetGatewayDomain();
  const { service = undefined } = useServiceQuery({
    ...lambda.metadata,
  });

  const rowRenderer = apiRule => ({
    cells: [
      <GoToApiRuleDetails apiRule={apiRule} />,
      <CopiableApiRuleHost apiRule={apiRule} domain={domain} />,
      <ApiRuleStatus apiRule={apiRule} />,
    ],
    collapseContent: <ApiRuleAccessStrategiesList apiRule={apiRule} />,
    showCollapseControl: !!apiRule.spec.rules,
    withCollapseControl: true,
  });

  const disableExposeButton = !(
    !!service || lambda?.status?.phase === LAMBDA_PHASES.RUNNING.TYPE
  );

  return (
    <ApiRulesListWrapper
      service={lambda}
      resourceType="Function"
      inSubView={true}
      redirectCtx="namespaces"
      redirectPath={`functions/details/${lambda.metadata.name}`}
      portForCreate="80"
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={textSearchProperties}
      disableExposeButton={disableExposeButton}
    />
  );
}
