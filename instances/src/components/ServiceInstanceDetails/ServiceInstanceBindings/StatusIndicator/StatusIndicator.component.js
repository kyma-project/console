import React, { Fragment } from 'react';

import { statusColor } from '../../../../commons/helpers';
import { StatusWrapper, Status } from './styled';

const StatusIndicator = ({ data }) => {
  const evaluateStatusesStats = () => {
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

  const statusesStats = evaluateStatusesStats();

  let statusType;
  if (statusesStats && statusesStats.FAILED) {
    statusType = 'FAILED';
  } else if (
    statusesStats &&
    (statusesStats.PENDING || statusesStats.UNKNOWN)
  ) {
    statusType = 'PENDING';
  }
  return (
    <Fragment>
      {statusType && (
        <StatusWrapper backgroundColor={statusColor(statusType)}>
          <Status>{statusesStats[statusType]}</Status>
        </StatusWrapper>
      )}
    </Fragment>
  );
};

export default StatusIndicator;
