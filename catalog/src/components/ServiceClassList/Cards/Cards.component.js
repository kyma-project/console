import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card.component';

import { getResourceDisplayName } from '../../../commons/helpers';

const Cards = ({ items, history }) => {
  return items.map(item => (
    <Card
      key={item.name}
      onClick={() => history.push(`/details/${item.name}`)}
      title={getResourceDisplayName(item)}
      company={item.providerDisplayName}
      description={item.description}
      imageUrl={item.imageUrl}
    />
  ));
};

Cards.propTypes = {
  items: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

export default Cards;
