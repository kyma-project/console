import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@kyma-project/react-components';

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
} from './styled';

const Card = ({ title, company, description, imageUrl, onClick }) => {
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
          <CardThumbnail imageUrl={imageUrl}>
            {imageUrl ? <CardImage src={imageUrl} /> : <Icon icon={'\ue113'} />}
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
  imageUrl: PropTypes.string,
};

export default Card;
