import React from 'react';
import { Badge } from 'fundamental-react';
import { BadgeTypes } from 'fundamental-react/lib/Badge/Badge';

interface AddonConfigurationBadgeProps {
  status: string;
  className: string;
}

const AddonConfigurationBadge: React.FunctionComponent<
  AddonConfigurationBadgeProps
> = ({ status, className }) => {
  let type: BadgeTypes;

  switch (status.toLowerCase()) {
    case 'ready':
      type = 'success';
      break;
    case 'failed':
      type = 'error';
      break;
    default:
      type = 'warning';
  }

  return (
    <Badge type={type} className={className}>
      {status}
    </Badge>
  );
};

export default AddonConfigurationBadge;
