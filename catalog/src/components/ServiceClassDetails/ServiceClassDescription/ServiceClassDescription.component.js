import React from 'react';
import PropTypes from 'prop-types';

import { Header, Separator, Text } from '@kyma-project/react-components';

import {
  ServiceClassDescriptionContentWrapper,
  ContentHeader,
  ContentDescription,
} from './styled';

const ServiceClassDescription = ({ description }) => {
  return (
    <ServiceClassDescriptionContentWrapper data-e2e-id="service-docs">
      <ContentHeader>
        <Header>General Information</Header>
      </ContentHeader>

      <Separator />
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
