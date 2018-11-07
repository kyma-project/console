import React, { Fragment } from 'react';

import { statusColor } from '../../../../commons/helpers';
import { StatusWrapper, Status } from './styled';

const StatusIndicator = ({ data }) => {
  const countByType = () => {
    if (!data) return;
    let statusCounts = {};
    const statusTypes = data
      .map(item => item.status.type)
      .filter((type, index, array) => array.indexOf(type) === index);

    for (let type of statusTypes) {
      statusCounts[type] = data.filter(
        item => item.status.type === type,
      ).length;
    }
    return statusCounts;
  };

  const statuses = countByType();

  let statusType;
  if (statuses && statuses.FAILED) {
    statusType = 'FAILED';
  } else if (statuses && (statuses.PENDING || statuses.UNKNOWN)) {
    statusType = 'PENDING';
  }
  return (
    <Fragment>
      {statusType && (
        <StatusWrapper backgroundColor={statusColor(statusType)}>
          <Status>{statuses[statusType]}</Status>
        </StatusWrapper>
      )}
    </Fragment>
  );
};

export default StatusIndicator;
