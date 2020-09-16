import React from 'react';

import { StatusBadge } from 'react-shared';
import { getBadgeTypeForStatus } from 'helpers/getBadgeTypeForStatus';

export const ServiceInstanceStatus = ({ instance }) => {
  const type = instance.status ? instance.status.type : 'UNKNOWN';
  return (
    <StatusBadge
      tooltipContent={instance.status?.message}
      type={getBadgeTypeForStatus(type)}
    >
      {type}
    </StatusBadge>
  );
};
