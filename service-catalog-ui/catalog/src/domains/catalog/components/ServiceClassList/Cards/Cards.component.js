import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import { DOCUMENTATION_PER_PLAN_LABEL } from '../../../../../shared/constants';
import Card from './Card.component';

import {
  getResourceDisplayName,
  isStringValueEqualToTrue,
} from '../../../../../commons/helpers';

const Cards = ({ items }) => {
  const goToDetails = item => {
    const documentationPerPlan =
      item.labels &&
      isStringValueEqualToTrue(item.labels[DOCUMENTATION_PER_PLAN_LABEL]);

    let path = `details/${item.name}`;

    if (documentationPerPlan) {
      if (item.plans.length > 1) {
        path = `details/${item.name}/plans`;
      } else {
        path = `details/${item.name}/plan/${item.plans[0].name}`;
      }
    }

    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(path);
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
