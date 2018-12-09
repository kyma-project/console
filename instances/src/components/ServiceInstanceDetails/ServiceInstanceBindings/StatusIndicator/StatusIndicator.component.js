import React, { Fragment } from 'react';

import { statusColor } from '../../../../commons/helpers';
import { StatusesList, StatusWrapper, Status } from './styled';

const StatusIndicator = ({ data }) => {
  if (!data) return;
  let statusesStats = {};
  const statusTypes = data
    .map(item => item.status.type)
    .filter((type, index, array) => array.indexOf(type) === index);

  let statusesLength = 0;
  for (let type of statusTypes) {
    const length = data.filter(
      item => item.status.type === type,
    ).length;
    statusesStats[type] = length;
    statusesLength += length;
  }

  return (
    <Fragment>
      <StatusesList>
        {statusesLength > 0 ? (
          <StatusWrapper backgroundColor={"#0a6ed1"}>
            <Status>{statusesLength}</Status>
          </StatusWrapper>
        ) : null}
        {statusesStats && (statusesStats.PENDING || statusesStats.UNKNOWN) ? (
          <StatusWrapper backgroundColor={statusColor('PENDING')}>
            <Status>{statusesStats.PENDING + statusesStats.UNKNOWN}</Status>
          </StatusWrapper>
        ) : null}
        {statusesStats && statusesStats.FAILED && (
          <StatusWrapper backgroundColor={statusColor('FAILED')}>
            <Status>{statusesStats.FAILED}</Status>
          </StatusWrapper>
        )}
      </StatusesList>
    </Fragment>
  );
};

export default StatusIndicator;
