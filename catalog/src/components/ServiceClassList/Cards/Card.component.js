import React from 'react';
import PropTypes from 'prop-types';

import { Label, Icon, Tooltip } from '@kyma-project/react-components';

import {
  CardWrapper,
  CardContent,
  CardTop,
  CardHeader,
  CardHeaderContent,
  CardIndicator,
  CardIndicatorGeneral,
  CardThumbnail,
  CardImage,
  CardDescription,
  CardFooter,
  CardLabelWrapper,
} from './styled';

import { isStringValueEqualToTrue } from '../../../commons/helpers';

const Card = ({
  title,
  company,
  description,
  imageUrl,
  numberOfInstances = 0,
  labels,
  onClick,
}) => {
  const itemId = title
    ? title
        .split(' ')
        .join('-')
        .toLowerCase()
    : '';

  const labelsDescription = {
    'connected-app':
      'This Service Class is connected to a given application by Application Connector.',
    local:
      'This Service Class provisions physical resources inside the cluster.',
    showcase:
      'This Service Class demonstrates a specific functionality. Do not use it on the production.',
  };

  const tooltipDescription = {
    provisionOnlyOnce:
      'You can provision this Service Class only once in a given Namespace.',
    provisionOnlyOnceActive:
      'You can provision this Service Class only once in a given Namespace. It is already provisioned in this Namespace.',
    instancesTooltipInfo: 'This Service Class is provisioned',
    instancesTooltipSingle: 'time.',
    instancesTooltipPlural: 'times.',
  };

  const isProvisionedOnlyOnce =
    labels &&
    labels.provisionOnlyOnce &&
    isStringValueEqualToTrue(labels.provisionOnlyOnce);

  return (
    <CardWrapper data-e2e-id="card">
      <CardContent onClick={onClick} data-e2e-id={`go-to-details-${itemId}`}>
        <CardTop>
          <CardHeader>
            <CardThumbnail>
              {imageUrl ? (
                <CardImage size="s" photo={imageUrl} />
              ) : (
                <Icon
                  glyph="crm-service-manager"
                  style={{ color: '#515559' }}
                />
              )}
            </CardThumbnail>

            <CardHeaderContent data-e2e-id="card-title" title={title}>
              {company}
            </CardHeaderContent>

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
                    data-e2e-id={`instances-provisioned-${itemId}`}
                    active={numberOfInstances ? 'true' : 'false'}
                  >
                    {numberOfInstances}
                  </CardIndicatorGeneral>
                </Tooltip>
              )}
            </CardIndicator>
          </CardHeader>
        </CardTop>

        <CardDescription>{description}</CardDescription>

        <CardFooter>
          {labels &&
            Object.keys(labels).length &&
            Object.keys(labels).map(label =>
              (label === 'local' || label === 'showcase' ? (
                isStringValueEqualToTrue(labels[label])
              ) : (
                label === 'connected-app' && labels[label]
              )) ? (
                <CardLabelWrapper key={label}>
                  <Tooltip content={labelsDescription[label]}>
                    <Label cursorType="help">
                      {label === 'connected-app'
                        ? labels['connected-app']
                        : label}
                    </Label>
                  </Tooltip>
                </CardLabelWrapper>
              ) : null,
            )}
        </CardFooter>
      </CardContent>
    </CardWrapper>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  imageUrl: PropTypes.string,
  labels: PropTypes.object,
};

export default Card;
