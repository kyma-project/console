import React from 'react';
import { StatusBadge } from 'react-shared';

const calculatePodState = pod => {
  const containerStatuses = pod?.status?.containerStatuses;
  if (containerStatuses?.length > 0) {
    const waitingStatus = containerStatuses
      .reverse()
      .find(element => element.state.waiting);
    if (waitingStatus) {
      return {
        status: waitingStatus.state.waiting.reason || 'Waiting',
        message: waitingStatus.state.waiting.message,
      };
    } else {
      const terminatedStatus = containerStatuses
        .reverse()
        .find(element => element.state.terminated);
      if (terminatedStatus) {
        return {
          status: terminatedStatus.state.terminated.reason || 'Terminated',
          message: terminatedStatus.state.terminated.message,
        };
      }
    }
  }
  return { state: 'Running' };
};

const badgeType = status => {
  switch (status) {
    case 'Running':
      return 'success';
    case 'Terminated':
    case 'Terminating':
    case 'PodInitializing':
      return 'info';
    default:
      return 'error';
  }
};

export const PodsList = DefaultRenderer => ({ ...otherParams }) => {
  const customColumns = [
    {
      header: 'Status',
      value: pod => {
        const podState = calculatePodState(pod);
        return (
          <StatusBadge
            tooltipContent={podState.message}
            type={badgeType(podState.status)}
          >
            {podState.status}
          </StatusBadge>
        );
      },
    },
  ];

  return <DefaultRenderer customColumns={customColumns} {...otherParams} />;
};
