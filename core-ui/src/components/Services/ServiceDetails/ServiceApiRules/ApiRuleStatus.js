import React from 'react';
import PropTypes from 'prop-types';

import { StatusBadge } from 'react-shared';

ApiRuleStatus.propTypes = {
  code: PropTypes.oneOf(['OK', 'SKIPPED', 'ERROR']),
  desc: PropTypes.string,
};

export default function ApiRuleStatus({ desc, code }) {
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
    <StatusBadge type={resolveAPIRuleStatus(code)} tooltipContent={desc}>
      {code}
    </StatusBadge>
  );
}
