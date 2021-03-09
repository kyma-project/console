import React from 'react';
import LuigiClient from '@luigi-project/client';

import { Link } from 'fundamental-react';
import { CopiableLink } from 'react-shared';

import AccessStrategies from 'components/ApiRules/AccessStrategies/AccessStrategies';
import { getApiRuleUrl } from 'components/ApiRules/helpers';

function goToApiRuleDetails(apiRule) {
  LuigiClient.linkManager()
    .fromContext('namespaces')
    .navigate(`cmf-apirules/details/${apiRule.metadata.name}`);
}

function navigateToService(apiRule) {
  LuigiClient.linkManager()
    .fromContext('namespaces')
    .navigate(`services/details/${apiRule.spec.service.name}`);
}

export function GoToApiRuleDetails({ apiRule }) {
  return (
    <Link className="link" onClick={() => goToApiRuleDetails(apiRule)}>
      {apiRule.metadata.name}
    </Link>
  );
}

export function CopiableApiRuleHost({ apiRule }) {
  return <CopiableLink url={getApiRuleUrl(apiRule.spec.service)} />;
}

export function ApiRuleServiceInfo({ apiRule, withName = true }) {
  if (withName) {
    return (
      <Link
        className="link no-border"
        onClick={() => navigateToService(apiRule)}
      >
        {`${apiRule.spec.service.name} (port: ${apiRule.spec.service.port})`}
      </Link>
    );
  }

  return <span>{apiRule.spec.service.port}</span>;
}

export function ApiRuleAccessStrategiesList({ apiRule, colSpan = '5' }) {
  return (
    <td colSpan={colSpan} className="api-rules-access-strategies">
      <AccessStrategies
        strategies={apiRule?.spec?.rules || []}
        showSearchField={false}
        compact={true}
      />
    </td>
  );
}
