import React from 'react';
import { isStringValueEqualToTrue } from '../../../commons/helpers';
import { Tooltip } from '@kyma-project/react-components';
import { CardIndicator, CardIndicatorGeneral } from './styled';

const tooltipDescription = {
  provisionOnlyOnce:
    'You can provision this Service Class only once in a given Namespace.',
  provisionOnlyOnceActive:
    'You can provision this Service Class only once in a given Namespace. It is already provisioned in this Namespace.',
  instancesTooltipInfo: 'This Service Class is provisioned',
  instancesTooltipSingle: 'time.',
  instancesTooltipPlural: 'times.',
};

export function InstancesIndicator({ numberOfInstances, labels }) {
  const isProvisionedOnlyOnce =
    labels &&
    labels.provisionOnlyOnce &&
    isStringValueEqualToTrue(labels.provisionOnlyOnce);
  return (
    <CardIndicator>
      {isProvisionedOnlyOnce && (
        <Tooltip
          content={
            numberOfInstances > 0
              ? tooltipDescription.provisionOnlyOnceActive
              : tooltipDescription.provisionOnlyOnce
          }
        >
          <CardIndicatorGeneral
            data-e2e-id="card-indicator"
            provisionOnce
            active={numberOfInstances ? 'true' : 'false'}
          >
            1
          </CardIndicatorGeneral>
        </Tooltip>
      )}
      {!isProvisionedOnlyOnce && numberOfInstances > 0 && (
        <Tooltip
          content={`${
            tooltipDescription.instancesTooltipInfo
          } ${numberOfInstances} ${
            numberOfInstances > 1
              ? tooltipDescription.instancesTooltipPlural
              : tooltipDescription.instancesTooltipSingle
          }`}
        >
          <CardIndicatorGeneral
            data-e2e-id={`instances-provisioned`}
            active={numberOfInstances ? 'true' : 'false'}
          >
            {numberOfInstances}
          </CardIndicatorGeneral>
        </Tooltip>
      )}
    </CardIndicator>
  );
}
