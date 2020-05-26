import React from 'react';
import classnames from 'classnames';
import { Tooltip } from 'react-shared';

import { isStringValueEqualToTrue } from 'helpers';
import './InstancesIndicator.scss';

const tooltipDescription = {
  provisionOnlyOnce:
    'You can provision this Service Class only once in a given Namespace.',
  provisionOnlyOnceActive:
    'You can provision this Service Class only once in a given Namespace. It is already provisioned in this Namespace.',
  instancesTooltipInfo: 'This Service Class is provisioned',
  instancesTooltipSingle: 'time.',
  instancesTooltipPlural: 'times.',
};

const CardIndicatorGeneral = ({ active, provisionOnce, children }) => {
  const className = classnames('instances-indicator--general', {
    active,
    'provision-once': provisionOnce,
  });
  return <div className={className}>{children}</div>;
};

export function InstancesIndicator({ numberOfInstances, labels }) {
  const isProvisionedOnlyOnce =
    labels &&
    labels.provisionOnlyOnce &&
    isStringValueEqualToTrue(labels.provisionOnlyOnce);
  return (
    <div className="instances-indicator">
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
            active={numberOfInstances > 0}
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
            active={numberOfInstances > 0}
          >
            {numberOfInstances}
          </CardIndicatorGeneral>
        </Tooltip>
      )}
    </div>
  );
}
