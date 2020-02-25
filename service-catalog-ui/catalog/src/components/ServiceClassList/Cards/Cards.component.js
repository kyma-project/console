import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import Card from './Card.component';

import {
  getResourceDisplayName,
  isStringValueEqualToTrue,
} from '../../../commons/helpers';

const Cards = ({ items }) => {
  const goToDetails = item => {
    const documentationPerPlan =
      item.labels &&
      item.labels['documentation-per-plan'] &&
      isStringValueEqualToTrue(item.labels['documentation-per-plan']);

    if (!documentationPerPlan) {
      return LuigiClient.linkManager()
        .fromClosestContext()
        .navigate(`details/${item.name}`);
    }

    return LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(`plans/${item.name}`);
  };

  return items.map(item => (
    <Card
      key={item.name}
      onClick={() => goToDetails(item)}
      title={getResourceDisplayName(item)}
      company={item.providerDisplayName}
      description={item.description}
      imageUrl={item.imageUrl}
      labels={item.labels}
      numberOfInstances={item.instances.length}
    />
  ));
};

Cards.propTypes = {
  items: PropTypes.array.isRequired,
};

export default Cards;
