import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@kyma-project/react-components';
import { InstancesIndicator } from './InstancesIndicator';
import { Labels } from './Labels';
import {
  CardWrapper,
  CardContent,
  CardTop,
  CardHeader,
  CardHeaderContent,
  CardThumbnail,
  CardImage,
  CardDescription,
} from './styled';

const Card = ({
  title,
  company,
  description,
  imageUrl,
  numberOfInstances = 0,
  labels,
  onClick,
}) => {
  return (
    <CardWrapper data-e2e-id="card">
      <CardContent onClick={onClick} data-e2e-id={`go-to-details`}>
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
              <span data-e2e-id="card-company">{company}</span>
            </CardHeaderContent>

            <InstancesIndicator
              numberOfInstances={numberOfInstances}
              labels={labels}
            />
          </CardHeader>
        </CardTop>

        <CardDescription>{description}</CardDescription>
        <Labels labels={labels} />
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
