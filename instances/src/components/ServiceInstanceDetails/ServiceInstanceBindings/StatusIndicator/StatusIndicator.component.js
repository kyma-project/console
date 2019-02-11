import React, { Fragment } from 'react';

import { statusColor } from '../../../../commons/helpers';
import { StatusesList, StatusWrapper, Status } from './styled';

const StatusIndicator = ({ data, testId }) => {
  if (!data) return;

  let statusesStats = {
    RUNNING: 0,
    PENDING: 0,
    UNKNOWN: 0,
    FAILED: 0,
  };
  const statusTypes = data
    .map(item => item.status.type)
    .filter((type, index, array) => array.indexOf(type) === index);

  let statusesLength = 0;
  for (let type of statusTypes) {
    const length = data.filter(item => item.status.type === type).length;
    statusesStats[type] = length;
    statusesLength += length;
  }

  return (
    <Fragment>
      {statusesLength > 0 && (
        <StatusesList>
          {statusesLength > 0 && (
            <StatusWrapper backgroundColor={'#0a6ed1'}>
              <Status data-e2e-id={testId}>{statusesLength}</Status>
            </StatusWrapper>
          )}
          {statusesStats &&
            (statusesStats.PENDING > 0 || statusesStats.UNKNOWN > 0) && (
              <StatusWrapper backgroundColor={statusColor('PENDING')}>
                <Status data-e2e-id={testId}>
                  {statusesStats.PENDING + statusesStats.UNKNOWN}
                </Status>
              </StatusWrapper>
            )}
          {statusesStats &&
            statusesStats.FAILED > 0 && (
              <StatusWrapper backgroundColor={statusColor('FAILED')}>
                <Status data-e2e-id={testId}>{statusesStats.FAILED}</Status>
              </StatusWrapper>
            )}
        </StatusesList>
      )}
    </Fragment>
  );
};

export default StatusIndicator;
