import React from 'react';
import { Badge } from 'fundamental-react/Badge';

const LambdaStatusBadge = ({ status }) => {
  let type;
  console.log(status);
  switch (status) {
    case 'Building':
    case 'Deploying':
    case 'Updating':
      return <Badge>{status}</Badge>;
    case 'Running':
      type = 'success';
      break;
    case 'Unknown':
      type = 'warning';
      break;
    case 'Error':
      type = 'error';
      break;
    default:
      type = 'warning';
  }

  return <Badge type={type}>{status}</Badge>;
};

export default LambdaStatusBadge;
