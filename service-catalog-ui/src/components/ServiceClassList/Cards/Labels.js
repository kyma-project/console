import React from 'react';
import { Label, PanelFooter } from '@kyma-project/react-components';
import { Tooltip } from 'react-shared';
import './Labels.scss';
import { isStringValueEqualToTrue } from 'helpers';
const labelsDescription = {
  'connected-app':
    'This Service Class is connected to a given application by Application Connector.',
  showcase:
    'This Service Class presents a specific functionality. Do not use it on the production cluster.',
};
export function Labels({ labels, ignoredLabels = [] }) {
  const ALWAYS_IGNORED_LABELS = ['local', 'provisionOnlyOnce'];
  return (
    <PanelFooter className="service-list--card__footer">
      {labels &&
        Object.keys(labels).map(label => {
          if (
            ALWAYS_IGNORED_LABELS.includes(label) ||
            ignoredLabels.includes(label)
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
              <Tooltip content={labelsDescription[label] || ''}>
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
