import React from 'react';

import { StatusBadge } from 'react-shared';

import {
  LAMBDA_PHASES,
  LAMBDA_ERROR_PHASES,
} from 'components/Lambdas/constants';

import { statusType } from 'components/Lambdas/helpers/lambdas';
import { formatMessage } from 'components/Lambdas/helpers/misc';

function hasTrueType(conditionType, conditions) {
  let cond = false;
  conditions.forEach(condition => {
    if (condition.type == conditionType && condition.status == 'True') {
      cond = true;
    }
  });
  return cond;
}

function getReason({ conditionType }) {
  switch (conditionType) {
    case 'ConfigurationReady':
      return 'CONFIG';
    case 'BuildReady':
      return 'JOB';
    case 'Running':
      return 'SERVICE';
    default:
      return 'CONFIG';
  }
}
function getFailedCondition(conditions) {
  let condition = {};
  let hasFailed = false;
  conditions.forEach(cond => {
    if (cond.status === 'False') {
      hasFailed = true;
      condition = cond;
    }
  });
  return { hasFailed, condition };
}
function getStatus(status) {
  if (!status || !status?.conditions.length) {
    return { phase: 'INITIALIZING', reason: null, message: null };
  }
  const functionIsRunning = hasTrueType('Running', status.conditions);
  const functionConfigCreated = hasTrueType(
    'ConfigurationReady',
    status.conditions,
  );
  const functionJobFinished = hasTrueType('BuildReady', status.conditions);

  const { hasFailed, condition } = getFailedCondition(status.conditions);

  if (hasFailed) {
    if (functionIsRunning) {
      return {
        phase: 'NEW_REVISION_ERROR',
        reason: getReason(condition.type),
        message: condition.message,
      };
    } else {
      return {
        phase: 'FAILED',
        reason: getReason(condition.type),
        message: condition.message,
      };
    }
  }

  let phase;
  if (functionConfigCreated) {
    if (functionJobFinished) {
      if (functionIsRunning) {
        phase = 'RUNNING';
      } else {
        phase = 'DEPLOYING';
      }
    } else {
      phase = 'BUILDING';
    }
  } else {
    phase = 'INITIALIZING';
  }

  return { phase: phase, reason: null, message: null };
}

export function LambdaStatusBadge({ status }) {
  const translatedStatus = getStatus(status);
  const statusPhase = translatedStatus.phase;

  const texts = LAMBDA_PHASES[statusPhase];
  let badgeType = statusType(statusPhase);
  if (badgeType === 'info') {
    badgeType = undefined;
  }

  let tooltipText;

  if (LAMBDA_ERROR_PHASES.includes(statusPhase)) {
    const formattedError = formatMessage(LAMBDA_PHASES.ERROR_SUFFIX, {
      error: translatedStatus.message,
    });
    tooltipText = `${texts.MESSAGE} ${formattedError}`;
  }

  return (
    <StatusBadge tooltipContent={tooltipText} type={badgeType}>
      {texts.TITLE}
    </StatusBadge>
  );
}
