import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@kyma-project/react-components';

import {
  CardWrapper,
  CardContent,
  CardTop,
  CardHeader,
  CardThumbnail,
  CardTitle,
  CardCompany,
  CardDescription,
} from './styled';

const Card = ({ title, company, description, onClick }) => {
  const itemId = title
    ? title
        .split(' ')
        .join('-')
        .toLowerCase()
    : '';

  return (
    <CardWrapper data-e2e-id="card">
      <CardContent onClick={onClick} data-e2e-id={`go-to-details-${itemId}`}>
        <CardTop>
          <CardThumbnail>
            <Icon icon={'\ue113'} />
          </CardThumbnail>

          <CardHeader>
            <CardTitle data-e2e-id="card-title">{title}</CardTitle>
            <CardCompany>{company}</CardCompany>
          </CardHeader>
        </CardTop>

        <CardDescription>{description}</CardDescription>
      </CardContent>
    </CardWrapper>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Card;
