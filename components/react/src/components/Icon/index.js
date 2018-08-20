import React from 'react';
import styled from 'styled-components';
import { media } from '../../commons';

const IconWrapper = styled.span`
  font-family: SAP-icons;
  color: ${props => (props.color ? props.color : 'none')};
`;

const Icon = ({ icon, color }) => (
  <IconWrapper data-e2e-id="icon" color={color}>
    {icon}
  </IconWrapper>
);

export default Icon;
