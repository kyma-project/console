import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Tooltip } from '@kyma-project/react-components';

import {
  CardWrapper,
  CardContent,
  CardTop,
  CardHeader,
  CardThumbnail,
  CardImage,
  CardTitle,
  CardCompany,
  CardDescription,
  CardFooter,
  CardLabelWrapper,
  CardLabelWithTooltip,
} from './styled';

import { isStringValueEqualToTrue } from '../../../commons/helpers';

const Card = ({ title, company, description, imageUrl, labels, onClick }) => {
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
      'This Service Class demonstrate a specific functionality. Do not use it on the production.',
  };

  return (
    <CardWrapper data-e2e-id="card">
      <CardContent onClick={onClick} data-e2e-id={`go-to-details-${itemId}`}>
        <CardTop>
          <CardThumbnail imageUrl={imageUrl}>
            {imageUrl ? <CardImage src={imageUrl} /> : <Icon icon={'\ue113'} />}
          </CardThumbnail>

          <CardHeader>
            <CardTitle data-e2e-id="card-title">{title}</CardTitle>
            <CardCompany>{company}</CardCompany>
          </CardHeader>
        </CardTop>

        <CardDescription>{description}</CardDescription>

        <CardFooter>
          {labels &&
            Object.keys(labels).length &&
            Object.keys(labels).map(
              label =>
                (label === 'local' || label === 'showcase' ? (
                  isStringValueEqualToTrue(labels[label])
                ) : (
                  label === 'connected-app' && labels[label]
                )) ? (
                  <CardLabelWrapper key={label}>
                    <Tooltip content={labelsDescription[label]}>
                      <CardLabelWithTooltip>
                        {label === 'connected-app'
                          ? labels['connected-app']
                          : label}
                      </CardLabelWithTooltip>
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
