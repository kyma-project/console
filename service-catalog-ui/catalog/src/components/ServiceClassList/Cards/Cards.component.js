import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { DOCUMENTATION_PER_PLAN_LABEL } from '../../../shared/constants';
import Card from './Card.component';

import {
  getResourceDisplayName,
  isStringValueEqualToTrue,
} from '../../../commons/helpers';

const Cards = ({ items }) => {
  const goToDetails = item => {
    const documentationPerPlan =
      item.labels &&
      isStringValueEqualToTrue(item.labels[DOCUMENTATION_PER_PLAN_LABEL]);

    if (!documentationPerPlan) {
      return LuigiClient.linkManager()
        .fromClosestContext()
        .navigate(`details/${item.name}`);
    }

    return LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(`details/${item.name}/plans`);
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
