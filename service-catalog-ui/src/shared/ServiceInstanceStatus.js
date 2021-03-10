import React from 'react';

import { StatusBadge } from 'react-shared';
import { getBadgeTypeForStatus } from 'helpers/getBadgeTypeForStatus';

export const ServiceInstanceStatus = ({ instance }) => {
  const lastCondition =
    instance.status.conditions?.length && instance.status.conditions[0];

  if (!lastCondition) return <StatusBadge type="info">UNKNOWN</StatusBadge>;

  return (
    <StatusBadge
      tooltipContent={lastCondition.message}
      type={getBadgeTypeForStatus(lastCondition.reason.toUpperCase())}
    >
      {lastCondition.reason}
    </StatusBadge>
  );
};
