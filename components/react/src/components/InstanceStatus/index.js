import React, { Component } from 'react';
import { InstanceStatus as Is } from './styled';
import { instanceStatusColor } from '../../commons/instance-status-color';

const InstanceStatus = ({ status }) => (
  <Is statusColor={instanceStatusColor(status)}>{status}</Is>
);

export default InstanceStatus;
