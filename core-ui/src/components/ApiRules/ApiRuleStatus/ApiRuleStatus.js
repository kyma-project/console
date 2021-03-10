import React from 'react';
import PropTypes from 'prop-types';

import { StatusBadge } from 'react-shared';

ApiRuleStatus.propTypes = {
  code: PropTypes.oneOf(['OK', 'SKIPPED', 'ERROR']),
  description: PropTypes.string,
};

const resolveAPIRuleStatus = statusCode => {
  switch (statusCode) {
    case 'OK':
      return 'success';
    case 'SKIPPED':
      return 'warning';
    case 'ERROR':
      return 'error';
    default:
      return undefined;
  }
};

export default function ApiRuleStatus({ apiRule }) {
  if (!apiRule.status.APIRuleStatus) {
    return null;
  }

  const { code, desc } = apiRule.status.APIRuleStatus;
  return (
    <StatusBadge type={resolveAPIRuleStatus(code)} tooltipContent={desc}>
      {code}
    </StatusBadge>
  );
}
