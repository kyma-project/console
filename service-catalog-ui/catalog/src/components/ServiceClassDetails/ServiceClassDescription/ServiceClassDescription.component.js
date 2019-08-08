import React from 'react';
import PropTypes from 'prop-types';

import { Text } from '@kyma-project/react-components';

import {
  ServiceClassDescriptionContentWrapper,
  ContentHeader,
  ContentDescription,
} from './styled';

const ServiceClassDescription = ({ description }) => {
  const headerText = 'General Information';
  return (
    <ServiceClassDescriptionContentWrapper
      colSpan={3}
      data-e2e-id="service-docs"
    >
      <ContentHeader>{headerText}</ContentHeader>

      <ContentDescription>
        <Text data-e2e-id="service-description" fontSize="14px">
          {description}
        </Text>
      </ContentDescription>
    </ServiceClassDescriptionContentWrapper>
  );
};

ServiceClassDescription.propTypes = {
  description: PropTypes.string.isRequired,
};

export default ServiceClassDescription;
