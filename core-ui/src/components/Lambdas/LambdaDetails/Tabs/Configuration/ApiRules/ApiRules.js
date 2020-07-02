import React from 'react';

import ApiRuleStatus from 'components/ApiRules/ApiRuleStatus/ApiRuleStatus';
import {
  GoToApiRuleDetails,
  CopiableApiRuleHost,
  ApiRuleAccessStrategiesList,
} from 'components/ApiRules/ApiRulesList/components';

import ApiRulesListWrapper from 'components/ApiRules/ApiRulesList/ApiRulesListWrapper';

const headerRenderer = () => ['', 'Name', 'Host', 'Status'];
const textSearchProperties = [
  'name',
  'service.host',
  'status.apiRuleStatus.code',
];

export default function ApiRules({ lambda }) {
  const rowRenderer = apiRule => ({
    cells: [
      <GoToApiRuleDetails apiRule={apiRule} />,
      <CopiableApiRuleHost apiRule={apiRule} />,
      <ApiRuleStatus apiRule={apiRule} />,
    ],
    collapseContent: <ApiRuleAccessStrategiesList apiRule={apiRule} />,
    showCollapseControl: !!apiRule.spec.rules,
    withCollapseControl: true,
  });

  return (
    <ApiRulesListWrapper
      service={lambda}
      resourceType="Function"
      inSubView={true}
      redirectCtx="namespaces"
      redirectPath={`cmf-functions/details/${lambda.name}`}
      portForCreate="80"
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={textSearchProperties}
    />
  );
}
