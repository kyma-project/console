import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import { DOCUMENTATION_PER_PLAN_LABEL } from 'helpers/constants';
import Card from './Card.component';

import { getResourceDisplayName, isStringValueEqualToTrue } from 'helpers';

const filterInstancesForClass = serviceClass => instance =>
  instance.spec.clusterServiceClassRef?.name === serviceClass.metadata.name ||
  instance.spec.serviceClassRef?.name === serviceClass.metadata.name;

const Cards = ({ items, serviceInstances }) => {
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

  return items.map(item => {
    const externalMetadata = item.spec.externalMetadata || {};
    const instancesOfThisClass = serviceInstances
      ? serviceInstances.filter(filterInstancesForClass(item))
      : [];

    return (
      <Card
        key={item.metadata.uid}
        onClick={() => goToDetails(item)}
        title={getResourceDisplayName(item)}
        company={externalMetadata.providerDisplayName}
        description={item.spec.description}
        imageUrl={externalMetadata.imageUrl}
        labels={externalMetadata.labels}
        numberOfInstances={instancesOfThisClass.length}
      />
    );
  });
};

Cards.propTypes = {
  items: PropTypes.array.isRequired,
};

export default Cards;
