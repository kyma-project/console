import React from 'react';

import { StatusBadge } from 'react-shared';

import {
  LAMBDA_PHASES,
  LAMBDA_ERROR_PHASES,
} from 'components/Lambdas/constants';

import { statusType } from 'components/Lambdas/helpers/lambdas';
import { formatMessage } from 'components/Lambdas/helpers/misc';

export function LambdaStatusBadge({ status }) {
  const statusPhase = status.phase;

  const texts = LAMBDA_PHASES[statusPhase];
  let badgeType = statusType(statusPhase);
  if (badgeType === 'info') {
    badgeType = undefined;
  }

  let tooltipText;

  if (LAMBDA_ERROR_PHASES.includes(statusPhase)) {
    const formattedError = formatMessage(LAMBDA_PHASES.ERROR_SUFFIX, {
      error: status.message,
    });
    tooltipText = `${texts.MESSAGE} ${formattedError}`;
  }

  return (
    <StatusBadge tooltipContent={tooltipText} type={badgeType}>
      {texts.TITLE}
    </StatusBadge>
  );
}
