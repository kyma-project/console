import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import Card from './Card.component';

import { getResourceDisplayName } from '../../../commons/helpers';

const Cards = ({ items, history }) => {
  const goToServiceClassDetails = name => {
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(`details/${name}`);
  };

  return items.map(item => (
    <Card
      key={item.name}
      onClick={() => goToServiceClassDetails(item.name)}
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
  history: PropTypes.object.isRequired,
};

export default Cards;
