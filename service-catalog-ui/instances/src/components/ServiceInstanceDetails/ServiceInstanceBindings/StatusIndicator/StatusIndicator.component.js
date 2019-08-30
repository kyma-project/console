import React, { Fragment } from 'react';
import { instanceStatusColor } from '@kyma-project/react-components';
import { Counter, Badge } from 'fundamental-react';

import { StatusesList, StatusWrapper } from './styled';

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

  /* eslint-disable no-unused-vars */
  let statusesLength = 0;
  for (let type of statusTypes) {
    const length = data.filter(item => item.status.type === type).length;
    statusesStats[type] = length;
    statusesLength += length;
  }
  /* eslint-enable no-unused-vars*/

  return (
    <Fragment>
      {statusesLength > 0 && (
        <StatusesList>
          {statusesLength > 0 && (
            <StatusWrapper>
              <Counter data-e2e-id={testId}>{statusesLength}</Counter>
            </StatusWrapper>
          )}
          {statusesStats &&
            (statusesStats.PENDING > 0 || statusesStats.UNKNOWN > 0) && (
              <StatusWrapper backgroundColor={instanceStatusColor('PENDING')}>
                <Badge modifier="filled" type="warning" data-e2e-id={testId}>
                  {statusesStats.PENDING + statusesStats.UNKNOWN}
                </Badge>
              </StatusWrapper>
            )}
          {statusesStats && statusesStats.FAILED > 0 && (
            <StatusWrapper backgroundColor={instanceStatusColor('FAILED')}>
              <Badge modifier="filled" type="error" data-e2e-id={testId}>
                {statusesStats.FAILED}
              </Badge>
            </StatusWrapper>
          )}
        </StatusesList>
      )}
    </Fragment>
  );
};

export default StatusIndicator;
