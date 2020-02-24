import React from 'react';
import { Label, Tooltip, PanelFooter } from '@kyma-project/react-components';
import './Labels.scss';
import { isStringValueEqualToTrue } from '../../../commons/helpers';
const labelsDescription = {
  'connected-app':
    'This Service Class is connected to a given application by Application Connector.',
  showcase:
    'This Service Class presents a specific functionality. Do not use it on the production cluster.',
};
export function Labels({ labels, ignoredLabels = [] }) {
  return (
    <PanelFooter className="service-list--card__footer">
      {labels &&
        Object.keys(labels).map(label => {
          if (
            label === 'local' ||
            label === 'provisionOnlyOnce' ||
            ignoredLabels.some(ignored => ignored === label)
          ) {
            return null;
          }
          if (
            (label === 'showcase' &&
              !isStringValueEqualToTrue(labels[label])) ||
            (label === 'connected-app' && !labels[label])
          ) {
            return null;
          }

          return (
            <div className="service-list--card__footer__labels" key={label}>
              <Tooltip content={labelsDescription[label]}>
                <Label cursorType="help">
                  {label === 'connected-app' ? labels['connected-app'] : label}
                </Label>
              </Tooltip>
            </div>
          );
        })}
    </PanelFooter>
  );
}
