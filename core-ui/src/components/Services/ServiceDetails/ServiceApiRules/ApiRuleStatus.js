import React from 'react';
import PropTypes from 'prop-types';

import { StatusBadge } from 'react-shared';

ApiRuleStatus.propTypes = {
  code: PropTypes.oneOf(['OK', 'SKIPPED', 'ERROR']),
  description: PropTypes.string,
};

export default function ApiRuleStatus({ description, code }) {
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

  return (
    <StatusBadge type={resolveAPIRuleStatus(code)} tooltipContent={description}>
      {code}
    </StatusBadge>
  );
}
