import React from 'react';
import PropTypes from 'prop-types';
import './Card.scss';
import { Tooltip } from '../../../react-shared';
import { Icon } from 'fundamental-react';
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

const DOCUMENTATION_PER_PLAN_DESCRIPTION = `
This service has different documentation and APIs for each plan
`; //TODO: change

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
    <CardWrapper data-e2e-id="card" className="card">
      <CardContent onClick={onClick} data-e2e-id={`go-to-details`}>
        <CardTop>
          <CardHeader className="card__header">
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

            <Tooltip title={DOCUMENTATION_PER_PLAN_DESCRIPTION}>
              <div className="icon">
                <Icon glyph="sap-box" size="l" />
              </div>
            </Tooltip>

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
