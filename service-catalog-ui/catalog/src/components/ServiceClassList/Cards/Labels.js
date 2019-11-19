import React from 'react';
import { Label, Tooltip } from '@kyma-project/react-components';
import { CardFooter, CardLabelWrapper } from './styled';

import { isStringValueEqualToTrue } from '../../../commons/helpers';
const labelsDescription = {
  'connected-app':
    'This Service Class is connected to a given application by Application Connector.',
  showcase:
    'This Service Class presents a specific functionality. Do not use it on the production cluster.',
};
export function Labels({ labels }) {
  return (
    <CardFooter>
      {labels &&
        Object.keys(labels).length &&
        Object.keys(labels).map(label => {
          if (label === 'local' || label === 'provisionOnlyOnce') {
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
            <CardLabelWrapper key={label}>
              <Tooltip content={labelsDescription[label]}>
                <Label cursorType="help">
                  {label === 'connected-app' ? labels['connected-app'] : label}
                </Label>
              </Tooltip>
            </CardLabelWrapper>
          );
        })}
    </CardFooter>
  );
}
